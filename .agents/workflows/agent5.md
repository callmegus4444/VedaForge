---
description: The most critical part of the project. Uses Groq (100% free, no credit card) with Llama 3.3 70B to build the structured prompt, call the AI, and validate the response into the JSON schema. Groq is ~10x faster than Claude/GPT
---

Build the AI generation module in vedaforge/backend/src/ai/.
■■ 1. INSTALL ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
npm install groq-sdk
■■ 2. PROMPT BUILDER ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
File: src/ai/promptBuilder.ts
Export function buildPrompt(data: PromptInput): string
PromptInput type:
questionTypes: [{ type, count, marks }]
instructions: string
fileContent?: string (extracted text from uploaded PDF)
The prompt must include:
a) Clear instruction to return ONLY valid JSON — no markdown,
no preamble, no explanation, just the JSON object
b) The exact JSON schema to follow (sections array)
c) The question type breakdown: exactly how many of each type
d) Difficulty distribution rule:
40% easy, 40% moderate, 20% hard
(adjust counts to hit this ratio)
e) If fileContent is provided: 'Generate questions based on
the following content: [fileContent]'
f) If no file: use instructions field as the topic
g) Section grouping rule: group questions by type into sections
(Section A = MCQ, Section B = Short Answer, etc.)
■■ 3. AI CALLER ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
File: src/ai/generatePaper.ts
import Anthropic from 'groq-sdk'
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
Export async function generateQuestionPaper(data): Promise
- Build prompt using promptBuilder
- Call llama-3.3-70b-versatile model
- max_tokens: 4000
- Parse response with responseParser
- If parsing fails: retry once with a stricter prompt
- If retry also fails: throw error (worker will handle it)
■■ 4. RESPONSE PARSER ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
File: src/ai/responseParser.ts
Export function parseResponse(rawText: string): GeneratedPaper
Steps:
1. Strip any accidental markdown fences (```json ... ```)
2. JSON.parse the cleaned string
3. Validate: sections array exists and is non-empty
4. Validate each section: has title, instruction, questions array
5. Validate each question: has text (string), difficulty
(must be 'easy'|'moderate'|'hard'), marks (positive number)
6. If any validation fails: throw new Error('Invalid AI response')
7. Return the validated object
■■ 5. FILE TEXT EXTRACTOR ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
File: src/ai/extractFileText.ts
- If uploaded file is a PDF: extract text using pdf-parse
- If image: pass base64 to Claude vision API
- Return extracted text as string
Install: npm install pdf-parse @types/pdf-parse
■■ 6. TEST IT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Create: src/ai/test.ts
- Call generateQuestionPaper with sample data
- console.log the result
- Run: ts-node src/ai/test.ts
- Confirm you get valid sections with questions