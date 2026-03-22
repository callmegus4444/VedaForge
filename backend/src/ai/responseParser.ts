import { IGeneratedPaper } from '../models/GeneratedPaper';

/**
 * Strips markdown fences, parses JSON, and runtime-validates the structure.
 * Auto-fixes common issues (missing title, type, difficulty) instead of crashing.
 * Throws an Error only on truly unrecoverable issues.
 */
export function parseResponse(rawText: string): Partial<IGeneratedPaper> {
  // 1. Strip markdown fences (e.g., ```json ... ```)
  let cleanText = rawText.trim();
  if (cleanText.startsWith('```')) {
    const firstNewline = cleanText.indexOf('\n');
    cleanText = cleanText.substring(firstNewline + 1);
  }
  if (cleanText.endsWith('```')) {
    cleanText = cleanText.substring(0, cleanText.length - 3).trim();
  }

  // 2. Parse JSON
  let data;
  try {
    data = JSON.parse(cleanText);
  } catch (err) {
    console.error('[PARSER] Raw text is not valid JSON, attempting fix...');
    // Try to extract JSON from the text
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        data = JSON.parse(jsonMatch[0]);
        console.log('[PARSER] Extracted JSON from raw text');
      } catch {
        throw new Error('AI Response is not valid JSON:\n' + cleanText.slice(0, 500));
      }
    } else {
      throw new Error('AI Response is not valid JSON:\n' + cleanText.slice(0, 500));
    }
  }

  // 3. Validate and auto-fix core objects
  if (!data || typeof data !== 'object') throw new Error('Root is not an object');

  // Auto-fix paperMeta
  if (!data.paperMeta) {
    console.warn('[PARSER] Missing paperMeta — creating default');
    data.paperMeta = {
      schoolName: 'VedaForge Academy',
      subject: 'General',
      class: 'General',
      timeAllowed: '45 minutes',
      totalMarks: 0,
      instructions: ['All questions are compulsory.'],
    };
  }

  // Auto-fix sections
  if (!Array.isArray(data.sections) || data.sections.length === 0) {
    throw new Error('Missing or empty sections array — AI gave no questions');
  }

  // Auto-fix answerKey
  if (!Array.isArray(data.answerKey)) {
    console.warn('[PARSER] Missing answerKey — creating empty array');
    data.answerKey = [];
  }

  // 4. Auto-fix sections
  const sectionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  for (const [sIdx, section] of data.sections.entries()) {
    // Auto-fix missing title
    if (!section.title) {
      section.title = `Section ${sectionLabels[sIdx] || (sIdx + 1)}`;
      console.warn(`[PARSER] Auto-fixed missing title for section ${sIdx}: ${section.title}`);
    }

    // Auto-fix missing type — guess from title or instruction
    if (!section.type) {
      if (section.title?.toLowerCase().includes('mcq') || section.title?.toLowerCase().includes('multiple')) {
        section.type = 'Multiple Choice Questions';
      } else if (section.title?.toLowerCase().includes('short')) {
        section.type = 'Short Questions';
      } else if (section.instruction) {
        section.type = section.instruction.slice(0, 40);
      } else {
        section.type = 'Questions';
      }
      console.warn(`[PARSER] Auto-fixed missing type for section ${sIdx}: ${section.type}`);
    }

    // Auto-fix missing instruction
    if (!section.instruction) {
      section.instruction = '';
    }

    // Auto-fix missing questions array
    if (!Array.isArray(section.questions)) {
      console.warn(`[PARSER] Section ${section.title} has no questions array — skipping`);
      section.questions = [];
      continue;
    }

    // 5. Auto-fix questions
    let questionNumber = 1;
    for (const [qIdx, q] of section.questions.entries()) {
      if (!q.text) {
        console.warn(`[PARSER] Removing question with no text in ${section.title}[${qIdx}]`);
        section.questions.splice(qIdx, 1);
        continue;
      }

      // Auto-fix number
      if (!q.number) {
        q.number = questionNumber;
      }
      questionNumber++;

      // Auto-fix marks
      if (typeof q.marks !== 'number' || q.marks <= 0) {
        q.marks = 1;
        console.warn(`[PARSER] Auto-fixed marks=1 for ${section.title}[${qIdx}]`);
      }

      // Auto-fix difficulty
      if (!q.difficulty || !['easy', 'moderate', 'hard'].includes(q.difficulty)) {
        // Try to normalize
        const raw = String(q.difficulty || '').toLowerCase();
        if (raw.includes('easy') || raw.includes('simple')) {
          q.difficulty = 'easy';
        } else if (raw.includes('hard') || raw.includes('difficult') || raw.includes('challenging')) {
          q.difficulty = 'hard';
        } else {
          q.difficulty = 'moderate';
        }
      }
    }
  }

  // Recalculate totalMarks if missing
  if (!data.paperMeta.totalMarks || data.paperMeta.totalMarks === 0) {
    let total = 0;
    for (const s of data.sections) {
      for (const q of s.questions) {
        total += q.marks || 0;
      }
    }
    data.paperMeta.totalMarks = total;
  }

  // Auto-generate answer key if empty
  if (data.answerKey.length === 0) {
    let qNum = 1;
    for (const s of data.sections) {
      for (const q of s.questions) {
        if (q.correctOption) {
          data.answerKey.push({ questionNumber: qNum, answer: q.correctOption });
        } else if (q.modelAnswer) {
          data.answerKey.push({ questionNumber: qNum, answer: q.modelAnswer.slice(0, 200) });
        }
        qNum++;
      }
    }
  }

  console.log('[PARSER] ✅ Validation passed — sections:', data.sections.length, 'total questions:', 
    data.sections.reduce((sum: number, s: any) => sum + s.questions.length, 0));

  return data as Partial<IGeneratedPaper>;
}
