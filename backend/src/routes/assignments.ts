import { Router, Request, Response } from 'express';
import Assignment from '../models/Assignment';
import GeneratedPaper from '../models/GeneratedPaper';
import { addGenerationJob } from '../queue/assignmentQueue';
import { getCachedPaper, deleteCachedPaper } from '../config/cache';

const router = Router();

// ── POST /api/assignments ─────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const { dueDate, questionTypes, instructions, fileUrl } = req.body;

    // Basic validation
    if (!dueDate || !questionTypes || !Array.isArray(questionTypes) || questionTypes.length === 0) {
      res.status(400).json({ success: false, error: 'dueDate and questionTypes[] are required' });
      return;
    }

    // Auto-generate title from first question type + due date
    const firstType = questionTypes[0]?.type ?? 'Assignment';
    const dateStr = new Date(dueDate).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
    const title = `${firstType} – Due ${dateStr}`;

    const assignment = await Assignment.create({
      title,
      dueDate: new Date(dueDate),
      questionTypes,
      instructions: instructions ?? '',
      fileUrl: fileUrl ?? undefined,
      status: 'pending',
    });

    // Add to BullMQ — fire and forget (don't await inside request)
    let jobId = assignment._id.toString();
    addGenerationJob(assignment._id.toString(), {
      questionTypes,
      instructions: instructions ?? '',
      fileUrl: fileUrl ?? undefined,
    })
      .then((id) => { jobId = id; })
      .catch((err) => console.error('[Queue] Failed to enqueue job:', err));

    // Respond immediately — must be < 200ms
    res.status(201).json({
      success: true,
      assignmentId: assignment._id,
      jobId,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: msg });
  }
});

// ── GET /api/assignments ──────────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json(assignments);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: msg });
  }
});

// ── GET /api/assignments/:id ──────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id).lean();
    if (!assignment) {
      res.status(404).json({ success: false, error: 'Assignment not found' });
      return;
    }

    // Check Redis cache first
    const cachedPaper = await getCachedPaper(req.params.id as string);
    if (cachedPaper) {
      res.json({ assignment, paper: cachedPaper });
      return;
    }

    const paper = await GeneratedPaper.findOne({ assignmentId: req.params.id }).lean();
    res.json({ assignment, paper: paper ?? null });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: msg });
  }
});

// ── POST /api/assignments/:id/retry ───────────────────────────────────────
router.post('/:id/retry', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, error: 'Assignment not found' });
      return;
    }

    console.log('[RETRY] Retrying assignment:', req.params.id);

    // Reset status to pending
    assignment.status = 'pending';
    await assignment.save();

    // Delete old generated paper if exists
    await GeneratedPaper.deleteOne({ assignmentId: req.params.id });
    await deleteCachedPaper(req.params.id as string);

    console.log('[RETRY] Old paper deleted, status reset to pending');

    // Add fresh BullMQ job with full assignment data
    // Use unique job ID with timestamp to avoid BullMQ dedup
    const { assignmentQueue } = await import('../queue/assignmentQueue');
    const uniqueJobId = `assignment-${assignment._id.toString()}-retry-${Date.now()}`;
    const job = await assignmentQueue.add(
      'generate-paper',
      {
        assignmentId: assignment._id.toString(),
        questionTypes: assignment.questionTypes.map(qt => ({
          type: qt.type,
          count: qt.count,
          marks: qt.marks,
        })),
        instructions: assignment.instructions || '',
        fileUrl: assignment.fileUrl || undefined,
      },
      {
        jobId: uniqueJobId,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      }
    );

    const jobId = job.id ?? uniqueJobId;
    console.log('[RETRY] New job added:', jobId);

    res.json({ success: true, message: 'Retry queued', jobId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    console.error('[RETRY] Error:', msg);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── DELETE /api/assignments/:id ───────────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, error: 'Assignment not found' });
      return;
    }
    await GeneratedPaper.deleteOne({ assignmentId: req.params.id });
    await deleteCachedPaper(req.params.id as string);
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: msg });
  }
});

export default router;
