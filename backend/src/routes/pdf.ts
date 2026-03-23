import { Router, Request, Response } from 'express';
import Assignment from '../models/Assignment';
import GeneratedPaper from '../models/GeneratedPaper';
import { getCachedPaper } from '../config/cache';

const router = Router();

// POST /api/assignments/:id/pdf
router.post('/:id/pdf', async (req: Request, res: Response) => {
  try {
    const { default: puppeteer } = await import('puppeteer');
    const assignment = await Assignment.findById(req.params.id).lean();
    if (!assignment) {
      res.status(404).json({ success: false, error: 'Assignment not found' });
      return;
    }

    // Get paper data (cache first)
    let rawPaper = await getCachedPaper(req.params.id as string);
    if (!rawPaper) {
      rawPaper = await (GeneratedPaper as any).findOne({ assignmentId: req.params.id }).lean() as object;
    }
    if (!rawPaper) {
      res.status(404).json({ success: false, error: 'Paper not generated yet' });
      return;
    }

    const paper = rawPaper as any;
    const meta = paper.paperMeta ?? {};

    // Build the HTML representation
    const sectionsHtml = (paper.sections ?? []).map((section: any) => {
      const questionsHtml = (section.questions ?? []).map((q: any) => {
        const marksLabel = `[${q.marks} Mark${q.marks !== 1 ? 's' : ''}]`;
        let optionsHtml = '';
        if (Array.isArray(q.options) && q.options.length > 0) {
          const labels = ['a', 'b', 'c', 'd'];
          optionsHtml = `<div class="options">${q.options.map((o: string, i: number) => `<span>${labels[i]}) ${o}</span>`).join('')}</div>`;
        }
        return `
          <div class="question">
            <p><strong>Q${q.number}.</strong> ${q.text} <span class="marks">${marksLabel}</span></p>
            ${optionsHtml}
          </div>`;
      }).join('');
      return `
        <div class="section">
          <h2>${section.title}</h2>
          <p class="section-type">${section.type}</p>
          <p class="instruction"><em>${section.instruction}</em></p>
          ${questionsHtml}
        </div>`;
    }).join('<hr/>');

    const answerKeyHtml = Array.isArray(paper.answerKey)
      ? paper.answerKey.map((a: any) => `<p>Q${a.questionNumber}. ${a.answer}</p>`).join('')
      : '';

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px 32px; font-size: 13px; color: #111; }
  .header { text-align: center; margin-bottom: 20px; }
  .header h1 { font-size: 24px; font-weight: bold; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em; }
  .header p { margin: 4px 0; font-size: 16px; font-weight: bold; color: #222; }
  .meta-row { display: flex; justify-content: space-between; margin: 16px 0; font-weight: bold; font-size: 14px; }
  .instructions { margin-bottom: 16px; }
  .instructions p { font-weight: bold; margin: 0 0 4px; font-size: 14px; }
  .instructions ul { margin: 0; padding-left: 24px; color: #333; line-height: 1.6; }
  .divider { border-top: 2px solid #111; margin: 16px 0; }
  .student-box { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 32px; font-size: 14px; padding: 16px 0; border-bottom: 1px solid #ccc; margin-bottom: 32px; }
  .student-field { display: flex; align-items: flex-end; gap: 8px; }
  .student-field .label { font-weight: bold; white-space: nowrap; }
  .student-field .line { flex: 1; border-bottom: 1px solid #666; height: 20px; display: inline-block; }
  .section { margin: 20px 0; }
  .section h2 { font-size: 15px; font-weight: bold; text-transform: uppercase; margin: 8px 0 2px; }
  .section-type { font-weight: bold; margin: 2px 0; }
  .instruction { color: #444; margin: 2px 0 10px; }
  .question { margin: 8px 0 4px; }
  .question p { margin: 0; }
  .options { display: flex; gap: 20px; margin-left: 20px; color: #333; }
  .marks { font-style: italic; color: #555; }
  .answer-key { margin-top: 32px; border-top: 2px solid #111; padding-top: 12px; }
  .answer-key h2 { font-size: 15px; font-weight: bold; }
</style>
</head>
<body>
  <div class="header">
    <h1>${meta.schoolName ?? 'VedaForge Academy'}</h1>
    <p>Subject: ${meta.subject ?? '—'} | Class: ${meta.class ?? '—'}</p>
  </div>
  
  <div class="meta-row">
    <span>Time Allowed: ${meta.timeAllowed ?? '60 minutes'}</span>
    <span>Maximum Marks: ${meta.totalMarks ?? 0}</span>
  </div>

  <div class="instructions">
    <p>General Instructions:</p>
    <ul>
      ${(meta.instructions?.length ? meta.instructions : ["All questions are compulsory unless stated otherwise."]).map((inst: string) => `<li>${inst}</li>`).join('')}
    </ul>
  </div>

  <div class="divider"></div>

  <div class="student-box">
    <div class="student-field"><span class="label">Name:</span><span class="line"></span></div>
    <div class="student-field"><span class="label">Roll Number:</span><span class="line"></span></div>
    <div class="student-field"><span class="label">Section:</span><span class="line"></span></div>
    <div class="student-field"><span class="label">Date:</span><span class="line"></span></div>
  </div>
  <div class="divider"></div>
  ${sectionsHtml}
  <div class="answer-key">
    <h2>Answer Key</h2>
    ${answerKeyHtml}
  </div>
</body>
</html>`;

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="assignment-${req.params.id}.pdf"`);
    res.send(Buffer.from(pdfBuffer));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'PDF generation failed';
    res.status(500).json({ success: false, error: msg });
  }
});

export default router;
