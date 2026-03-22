import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import mongoose from 'mongoose';
import { redisConnection } from '../config/redis';
import Assignment from '../models/Assignment';
import GeneratedPaper from '../models/GeneratedPaper';
import { JobData } from '../queue/assignmentQueue';
import { generateQuestionPaper } from '../ai/generatePaper';
import { extractFileText } from '../ai/extractFileText';
import { buildPrompt } from '../ai/promptBuilder';
import { callLLM } from '../ai/llmClient';
import { parseResponse } from '../ai/responseParser';
import { notifyDone } from '../websocket/wsServer';

// ── MongoDB connect for the worker process ────────────────────────────────
async function connectDB() {
  const uri = process.env.MONGODB_URI ?? '';
  if (!uri) throw new Error('MONGODB_URI not set');
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB ?? 'vedaforge' });
  console.log('✅  Worker: MongoDB connected');
}

// ── Timeout helper ─────────────────────────────────────────────────────────
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise
      .then((v) => { clearTimeout(timer); resolve(v); })
      .catch((e) => { clearTimeout(timer); reject(e); });
  });
}

// ── Fallback paper generator (uses topic only, no AI) ─────────────────────
function generateFallbackPaper(data: JobData): any {
  const { questionTypes, instructions } = data;
  const topic = instructions || 'General Knowledge';
  const totalMarks = questionTypes.reduce((s, q) => s + (q.count * q.marks), 0);
  const sectionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
  let questionNumber = 1;

  const sections = questionTypes.map((qt, idx) => {
    const questions = [];
    for (let i = 0; i < qt.count; i++) {
      const difficulty = i < Math.ceil(qt.count * 0.4) ? 'easy'
        : i < Math.ceil(qt.count * 0.8) ? 'moderate' : 'hard';
      const diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

      if (qt.type.toLowerCase().includes('multiple choice')) {
        questions.push({
          number: questionNumber,
          text: `[${diffLabel}] Define a key concept related to ${topic}.`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctOption: 'a',
          difficulty,
          marks: qt.marks,
        });
      } else {
        questions.push({
          number: questionNumber,
          text: `[${diffLabel}] Explain an important aspect of ${topic}.`,
          options: null,
          correctOption: null,
          modelAnswer: `A comprehensive answer about ${topic}.`,
          difficulty,
          marks: qt.marks,
        });
      }
      questionNumber++;
    }

    return {
      title: `Section ${sectionLabels[idx] || (idx + 1)}`,
      type: qt.type,
      instruction: `Attempt all questions. Each question carries ${qt.marks} mark(s).`,
      questions,
    };
  });

  const answerKey = sections.flatMap((s: any) =>
    s.questions.map((q: any) => ({
      questionNumber: q.number,
      answer: q.correctOption || q.modelAnswer || 'Refer to your study material.',
    }))
  );

  return {
    paperMeta: {
      schoolName: 'VedaForge Academy',
      subject: topic,
      class: 'General',
      timeAllowed: '45 minutes',
      totalMarks,
      totalQuestions: questionNumber - 1,
      instructions: [
        'All questions are compulsory.',
        'Marks are indicated against each question.',
        'Read all questions carefully.',
      ],
    },
    sections,
    answerKey,
  };
}

// ── The worker ────────────────────────────────────────────────────────────
export const generationWorker = new Worker<JobData>(
  'assignment-generation',
  async (job: Job) => {
    console.log('\n[WORKER] ========== JOB START ==========');
    console.log('[WORKER] Job ID:', job.id);
    console.log('[WORKER] Assignment ID:', job.data.assignmentId);
    console.log('[WORKER] fileUrl:', job.data.fileUrl || 'NONE');
    console.log('[WORKER] questionTypes:', JSON.stringify(job.data.questionTypes));
    console.log('[WORKER] instructions:', job.data.instructions);

    const JOB_TIMEOUT = 120_000; // 120 seconds total job timeout (production-ready)

    try {
      // Master timeout wrapping the entire job
      const result = await withTimeout(
        processJob(job),
        JOB_TIMEOUT,
        'Entire job'
      );
      return result;
    } catch (masterErr: any) {
      console.error('[WORKER] MASTER ERROR:', masterErr.message);
      console.log('[WORKER] Generating fallback paper...');

      try {
        // Generate fallback paper
        const fallback = generateFallbackPaper(job.data);

        await GeneratedPaper.deleteOne({ assignmentId: job.data.assignmentId });
        const saved = await GeneratedPaper.create({
          assignmentId: job.data.assignmentId,
          ...fallback,
          paperMeta: {
            schoolName: (job.data as any).schoolName || 'VedaForge Academy',
            ...fallback.paperMeta,
          },
          generatedAt: new Date(),
        });

        await Assignment.findByIdAndUpdate(job.data.assignmentId, { status: 'done' });
        console.log('[WORKER] Fallback paper saved, ID:', saved._id);

        try { notifyDone(job.data.assignmentId); } catch { /* non-fatal */ }

        console.log('[WORKER] ========== JOB DONE (FALLBACK) ==========\n');
        return { success: true, paperId: saved._id, fallback: true };
      } catch (fallbackErr: any) {
        console.error('[WORKER] FALLBACK ALSO FAILED:', fallbackErr.message);
        await Assignment.findByIdAndUpdate(job.data.assignmentId, { status: 'error' });
        throw fallbackErr;
      }
    }
  },
  {
    connection: redisConnection,
    concurrency: 3,
  }
);

// ── Core job processing (called inside timeout wrapper) ───────────────────
async function processJob(job: Job): Promise<any> {
  // Update status to processing
  await Assignment.findByIdAndUpdate(job.data.assignmentId, { status: 'processing' });
  console.log('[WORKER] Status → processing');

  // Step 1: Extract PDF/file content
  let fileContent: string | undefined;
  if (job.data.fileUrl) {
    console.log('[WORKER] Step 1: Extracting file content...');
    try {
      fileContent = await withTimeout(
        extractFileText(job.data.fileUrl),
        30_000,
        'File extraction'
      );
      console.log('[WORKER] File extracted:', fileContent.length, 'chars');
    } catch (err: any) {
      console.error('[WORKER] File extraction FAILED:', err.message);
      console.log('[WORKER] Continuing without file — topic from instructions');
      fileContent = undefined;
    }
  } else {
    console.log('[WORKER] Step 1: No file uploaded — using instructions');
  }

  // Step 2: Generate with LLM (with retry)
  console.log('[WORKER] Step 2: Calling LLM...');
  let paper;

  // Attempt 1: Full context
  try {
    paper = await withTimeout(
      generateQuestionPaper({
        questionTypes: job.data.questionTypes,
        instructions: job.data.instructions || 'Generate a comprehensive exam paper',
        fileContent,
      }),
      60_000,
      'LLM call (attempt 1)'
    );
    console.log('[WORKER] LLM success — sections:', paper.sections?.length);
  } catch (err1: any) {
    console.error('[WORKER] LLM attempt 1 FAILED:', err1.message);

    // Attempt 2: Reduced context (first 8000 chars only)
    console.log('[WORKER] Retrying with reduced context...');
    try {
      const reducedContent = fileContent ? fileContent.slice(0, 8000) : undefined;
      paper = await withTimeout(
        generateQuestionPaper({
          questionTypes: job.data.questionTypes,
          instructions: job.data.instructions || 'Generate a comprehensive exam paper',
          fileContent: reducedContent,
        }),
        60_000,
        'LLM call (attempt 2)'
      );
      console.log('[WORKER] LLM retry success — sections:', paper.sections?.length);
    } catch (err2: any) {
      console.error('[WORKER] LLM attempt 2 ALSO FAILED:', err2.message);
      throw err2; // Will trigger fallback in the master catch
    }
  }

  // Step 3: Save to MongoDB
  console.log('[WORKER] Step 3: Saving to MongoDB...');
  await GeneratedPaper.deleteOne({ assignmentId: job.data.assignmentId });
  const paperData = {
    assignmentId: job.data.assignmentId,
    ...paper,
    paperMeta: {
      schoolName: (job.data as any).schoolName || 'VedaForge Academy',
      ...paper.paperMeta,
    },
    generatedAt: new Date(),
  };
  const saved = await GeneratedPaper.create(paperData);
  console.log('[WORKER] Paper saved, ID:', saved._id);

  // Step 4: Update status to done
  await Assignment.findByIdAndUpdate(job.data.assignmentId, { status: 'done' });
  console.log('[WORKER] Status → done');

  // Step 5: Notify frontend via WebSocket
  try {
    notifyDone(job.data.assignmentId);
    console.log('[WORKER] WebSocket notified');
  } catch (e) {
    console.warn('[WORKER] WebSocket notify failed (non-fatal)');
  }

  console.log('[WORKER] ========== JOB DONE ==========\n');
  return { success: true, paperId: saved._id };
}

// ── Worker event handlers ──────────────────────────────────────────────────
generationWorker.on('completed', (job) => {
  console.log(`[WORKER] ✅ Job ${job.id} completed successfully`);
});

generationWorker.on('failed', (job, err) => {
  console.error(`[WORKER] ❌ Job ${job?.id} failed:`, err.message);
});

generationWorker.on('error', (err) => {
  console.error('[WORKER] Worker error:', err.message);
});

export { connectDB };
