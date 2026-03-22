---

# VedaForge — AI Assessment Creator

> Built in **6 hours, 12 minutes, 11 seconds, and 92 milliseconds** ⚡

![VedaForge Banner](./figma-assests/screenshot_paper_output.png)

## What is VedaForge?

VedaForge is an AI-powered exam paper generator that allows 
teachers to create professional, structured question papers 
in seconds. Upload a PDF of any chapter or topic, configure 
your question types and marks, and let AI generate a 
complete exam paper — with sections, difficulty tags, 
and a full answer key.

## Market Opportunity

The global EdTech market is valued at **$142 billion in 2024** 
and projected to reach **$348 billion by 2030** (CAGR: 16.5%).

AI-powered assessment tools are one of the fastest-growing 
segments:
- Over **3.7 million teachers** in India alone create exam 
  papers manually every semester
- Average time to create a quality exam paper manually: 
  **4-6 hours**
- VedaForge reduces this to **under 30 seconds**
- Target market (India K-12 + Higher Ed teachers): 
  **$2.4 billion addressable market**
- Global opportunity (teacher productivity tools): 
  **$18 billion by 2027**

## Features

- Upload PDF / image of any chapter
- Configure question types: MCQ, Short Answer, 
  Diagram-Based, Numerical
- Set marks and question count per type
- AI generates questions from your actual document
- Difficulty distribution: 40% Easy, 40% Moderate, 20% Hard
- Download as PDF — print-ready format
- Real-time generation via WebSocket
- Mobile responsive

## Agent System (Built with Antigravity)

This project was built using a multi-agent system:

| Agent | Role | What it did |
|-------|------|-------------|
| **Global Agent** | Project Monitor | Maintained full context across all sessions, enforced rules and schema consistency |
| **Agent S** | Scraper | Scraped myvedaai.com using Firecrawl, extracted design tokens, colors, fonts, component inventory |
| **Agent T** | Paper Formatter | Enforced the exact question paper format — sections, difficulty tags, answer key structure |
| **Agent 1** | Data Extractor | Built the RAG pipeline — PDF extraction, chunking, context selection, Groq prompt injection |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Zustand, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas |
| Queue | BullMQ + Redis Cloud |
| Real-time | Socket.io WebSocket |
| AI | Groq (llama-3.3-70b-versatile) |
| RAG | Python Flask + pypdf |
| PDF Export | Puppeteer |

## Setup Instructions

### Prerequisites
- Node.js 20+
- Python 3.10+
- MongoDB Atlas account (free)
- Redis Cloud account (free)
- Groq API key (free at console.groq.com)

### Environment Variables

Create \`vedaforge/backend/.env\`:
\`\`\`env
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile
PORT=4000
FRONTEND_URL=http://localhost:3000
ACTIVE_LLM=groq
\`\`\`

Create \`vedaforge/frontend/.env.local\`:
\`\`\`env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
\`\`\`

### Run Locally

Open 4 terminals:

Terminal 1 — RAG Service:
\`\`\`bash
cd vedaforge/rag-service
pip install flask pypdf
python app.py
\`\`\`

Terminal 2 — Backend API:
\`\`\`bash
cd vedaforge/backend
npm install
npm run dev
\`\`\`

Terminal 3 — BullMQ Worker:
\`\`\`bash
cd vedaforge/backend
npm run worker
\`\`\`

Terminal 4 — Frontend:
\`\`\`bash
cd vedaforge/frontend
npm install
npm run dev
\`\`\`

Open http://localhost:3000

## How to Use

1. Click **Create Assignment**
2. Upload a PDF of your chapter (optional)
3. Set due date
4. Add question types: MCQ, Short Answer, etc.
5. Set number of questions and marks per type
6. Add any formatting instructions
7. Click **Next** — paper generates in 10-20 seconds
8. View the formatted paper
9. Click **Download as PDF**

## Time to Build

> This entire full-stack application — frontend, backend, 
> AI pipeline, RAG service, real-time WebSocket system, 
> PDF export, and mobile responsive UI — was built in:
>
> ## ⏱️ 6 hours, 12 minutes, 11 seconds, and 92 milliseconds

## License

MIT — free to use and modify.

---

*Built for the VedaAI Full Stack Engineering Assignment*
*Role: Full Stack Engineer*

---
