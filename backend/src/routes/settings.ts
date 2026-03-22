import { Router, Request, Response } from 'express';
import { setRuntimeLLM, getActiveProvider } from '../ai/llmClient';

const router = Router();

// POST /api/settings/llm — switch LLM at runtime
router.post('/llm', (req: Request, res: Response) => {
  try {
    const { provider, apiKey } = req.body;

    if (!provider || !['groq', 'gemini', 'openai'].includes(provider)) {
      res.status(400).json({ success: false, error: 'provider must be groq, gemini, or openai' });
      return;
    }
    if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
      res.status(400).json({ success: false, error: 'A valid apiKey is required' });
      return;
    }

    setRuntimeLLM(provider, apiKey);
    res.json({ success: true, provider });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: msg });
  }
});

// GET /api/settings/llm — get current active provider
router.get('/llm', (_req: Request, res: Response) => {
  res.json({ success: true, provider: getActiveProvider() });
});

export default router;
