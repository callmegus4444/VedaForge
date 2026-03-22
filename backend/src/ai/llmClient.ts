import 'dotenv/config';

// Runtime overrides (set by POST /api/settings/llm)
let runtimeProvider: string | null = null;
let runtimeKeys: Record<string, string> = {};

export function setRuntimeLLM(provider: string, apiKey: string): void {
  runtimeProvider = provider;
  const keyMap: Record<string, string> = {
    groq: 'GROQ_API_KEY',
    gemini: 'GEMINI_API_KEY',
    openai: 'OPENAI_API_KEY',
  };
  if (keyMap[provider]) {
    runtimeKeys[keyMap[provider]] = apiKey;
  }
  console.log(`[LLM] Runtime provider set to: ${provider}`);
}

export function getActiveProvider(): string {
  return runtimeProvider || process.env.ACTIVE_LLM || 'groq';
}

function getKey(envKey: string): string | undefined {
  return runtimeKeys[envKey] || process.env[envKey];
}

/**
 * Unified LLM caller. Reads ACTIVE_LLM and dispatches accordingly.
 * Returns raw string response (expected JSON).
 */
export async function callLLM(prompt: string): Promise<string> {
  const active = getActiveProvider();
  console.log(`[LLM] Using provider: ${active}`);

  // ── Groq ──────────────────────────────────────────────────────────────
  if (active === 'groq') {
    const apiKey = getKey('GROQ_API_KEY');
    if (!apiKey) throw new Error('GROQ_API_KEY not set');

    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey, timeout: 60_000, maxRetries: 2 });
    const res = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });
    return res.choices[0].message.content || '';
  }

  // ── Gemini ────────────────────────────────────────────────────────────
  if (active === 'gemini') {
    const apiKey = getKey('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  // ── OpenAI ────────────────────────────────────────────────────────────
  if (active === 'openai') {
    const apiKey = getKey('OPENAI_API_KEY');
    if (!apiKey) throw new Error('OPENAI_API_KEY not set');

    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey });
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });
    return res.choices[0].message.content || '';
  }

  throw new Error(
    `No valid LLM configured. Set ACTIVE_LLM to groq|gemini|openai and provide the matching API key in .env`
  );
}
