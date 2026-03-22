export function buildPrompt(data: {
  questionTypes: { type: string, count: number, marks: number }[]
  instructions: string
  fileContent?: string
}): string {

  const { questionTypes, instructions, fileContent } = data
  
  const totalQuestions = questionTypes.reduce((s, q) => s + q.count, 0)
  const totalMarks = questionTypes.reduce((s, q) => s + (q.count * q.marks), 0)
  
  const sectionConfig = questionTypes.map((q, i) => {
    const letter = String.fromCharCode(65 + i)
    return `Section ${letter}: EXACTLY ${q.count} ${q.type} questions worth ${q.marks} mark(s) each`
  }).join('\n')

  const documentSection = fileContent && fileContent.length > 100
    ? `
DOCUMENT CONTENT (source of ALL questions):
===========================================
${fileContent}
===========================================
CRITICAL: Every question MUST come directly from the 
document above. Do not use outside knowledge.
Do not make up facts not present in the document.
`
    : `TOPIC: ${instructions}`

  return `${documentSection}

You are an expert professional exam paper generator.

EXACT QUESTION CONFIGURATION — FOLLOW PRECISELY:
${sectionConfig}

TOTAL: ${totalQuestions} questions worth ${totalMarks} marks

TEACHER INSTRUCTIONS: ${instructions}

DIFFICULTY RULES:
- 40% of questions in each section = Easy
- 40% of questions in each section = Moderate  
- 20% of questions in each section = Hard
- Tag each question: [Easy] [Moderate] or [Hard]

STRICT RULES:
1. Return ONLY valid JSON — no markdown, no explanation
2. Generate EXACTLY the number of questions specified above
3. Number questions continuously: Q1, Q2, Q3... across sections
4. MCQ must have exactly 4 options: a) b) c) d)
5. Every answer key entry must reference the document

RETURN THIS EXACT JSON STRUCTURE:
{
  "paperMeta": {
    "subject": "identify from document",
    "class": "identify from document",  
    "timeAllowed": "45 minutes",
    "totalMarks": ${totalMarks},
    "totalQuestions": ${totalQuestions},
    "instructions": [
      "All questions are compulsory.",
      "Marks are indicated against each question.",
      "Read all questions carefully."
    ]
  },
  "sections": [
    {
      "title": "Section A",
      "type": "${questionTypes[0]?.type || 'Questions'}",
      "instruction": "Attempt all questions.",
      "questions": [
        {
          "number": 1,
          "text": "[Easy] Question from document?",
          "options": null,
          "correctOption": null,
          "difficulty": "easy",
          "marks": ${questionTypes[0]?.marks || 1}
        }
      ]
    }
  ],
  "answerKey": [
    {
      "questionNumber": 1,
      "answer": "answer here",
      "explanation": "from document: relevant quote"
    }
  ]
}
`
}
