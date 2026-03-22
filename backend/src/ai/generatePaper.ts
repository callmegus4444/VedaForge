import { callLLM } from './llmClient'
import { buildPrompt } from './promptBuilder'
import { parseResponse } from './responseParser'

export async function generateQuestionPaper(data: any) {
  console.log('[AI] ===== LLM CALL START =====')
  console.log('[AI] questionTypes:', JSON.stringify(data.questionTypes))
  console.log('[AI] fileContent length:', data.fileContent?.length || 0)
  console.log('[AI] instructions:', data.instructions)
  
  const prompt = buildPrompt(data)
  console.log('[AI] prompt length:', prompt.length)
  console.log('[AI] prompt preview:', prompt.slice(0, 600))
  
  console.log('[AI] Sending to LLM...')
  const startTime = Date.now()

  const raw = await callLLM(prompt)

  const elapsed = Date.now() - startTime
  console.log(`[AI] LLM responded in ${elapsed}ms`)
  console.log('[AI] raw response length:', raw.length)
  console.log('[AI] raw preview:', raw.slice(0, 400))

  const parsed = parseResponse(raw)
  console.log('[AI] parsed sections:', parsed.sections?.length)
  console.log('[AI] ===== LLM CALL DONE =====')
  
  return parsed
}
