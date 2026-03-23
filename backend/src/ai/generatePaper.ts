import { callLLM } from './llmClient'
import { buildPrompt } from './promptBuilder'
import { parseResponse } from './responseParser'

export async function generateQuestionPaper(data: any) {
  console.log('[AI] ===== LLM CALL START =====')
  console.log('[AI] questionTypes:', JSON.stringify(data.questionTypes))
  
  const ctxLen = data.fileContent?.length || 0;
  console.log(`[AI] FILE_TRACE_3: fileContent received in generator. Length: ${ctxLen} chars`)
  if (ctxLen > 0) {
    console.log(`[AI] FILE_TRACE_3.1: Extracted text snippet preview: ${(data.fileContent as string).slice(0, 200)}`)
  } else {
    console.log(`[AI] FILE_TRACE_3.1: WARNING! Extracted text is EMPTY or UNDEFINED!`)
  }

  console.log('[AI] instructions:', data.instructions)
  
  const prompt = buildPrompt(data)
  console.log(`[AI] FILE_TRACE_5: Final assembled LLM Prompt Length: ${prompt.length} chars`)
  console.log('[AI] prompt preview:', prompt.slice(0, 300))
  
  console.log('[AI] Sending to LLM...')
  const startTime = Date.now()

  const raw = await callLLM(prompt)

  const elapsed = Date.now() - startTime
  console.log(`[AI] LLM responded in ${elapsed}ms`)
  console.log(`[AI] FILE_TRACE_6: LLM raw response length: ${raw.length} chars`)
  console.log('[AI] raw preview:', raw.slice(0, 400))

  const parsed = parseResponse(raw)
  console.log('[AI] parsed sections:', parsed.sections?.length)
  console.log('[AI] ===== LLM CALL DONE =====')
  
  return parsed
}
