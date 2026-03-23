<div align="center">

```
██╗   ██╗███████╗██████╗  █████╗ ███████╗ ██████╗ ██████╗  ██████╗ ███████╗
██║   ██║██╔════╝██╔══██╗██╔══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
██║   ██║█████╗  ██║  ██║███████║█████╗  ██║   ██║██████╔╝██║  ███╗█████╗  
╚██╗ ██╔╝██╔══╝  ██║  ██║██╔══██║██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  
 ╚████╔╝ ███████╗██████╔╝██║  ██║██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
  ╚═══╝  ╚══════╝╚═════╝ ╚═╝  ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
```

### 🎓 AI-Powered Exam Paper Generator for Teachers

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js_20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.com)
[![Python](https://img.shields.io/badge/Python_3.10-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=for-the-badge)](https://groq.com)

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-vedaforge.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://vedaforge.netlify.app)

<br/>

> ### ⏱️ Built in `6 hours` · `12 minutes` · `11 seconds` · `92 milliseconds`
> *Full-stack app · AI pipeline · RAG service · WebSocket · PDF export · Mobile responsive*

<br/>

---

</div>

## 📌 What is VedaForge?

VedaForge is a production-grade, full-stack **AI-powered assessment creator** built for teachers. It eliminates the most time-consuming part of a teacher's job — writing exam papers from scratch.

**How it works in 3 steps:**
1. Upload your chapter PDF (or describe a topic)
2. Choose question types, counts, and marks
3. Get a fully formatted, print-ready question paper in under 30 seconds

VedaForge generates questions **directly from your uploaded document** using a RAG (Retrieval-Augmented Generation) pipeline — not from generic AI knowledge. Every question is traceable back to your source material.

<br/>

---

## 💰 Market Opportunity

> The global EdTech market is one of the fastest-growing sectors in the world.

| Metric | Value |
|--------|-------|
| 🌍 Global EdTech Market (2024) | **$142 Billion** |
| 📈 Projected Market Size (2030) | **$348 Billion** |
| 🚀 CAGR | **16.5%** |
| 👩‍🏫 Teachers in India creating papers manually | **3.7 Million+** |
| ⏰ Average time to write one paper manually | **4–6 Hours** |
| ⚡ VedaForge generation time | **Under 30 Seconds** |
| 🇮🇳 India K-12 + Higher Ed addressable market | **$2.4 Billion** |
| 🌐 Global teacher productivity tools (2027) | **$18 Billion** |

> **The problem is real:** Over 3.7 million teachers in India alone spend 4-6 hours creating exam papers every semester. VedaForge reduces this to seconds — that's a **99.8% time reduction** per paper.

<br/>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **PDF / Image Upload** | Upload any chapter or study material |
| 🎯 **Question Configuration** | MCQ, Short Answer, Diagram-Based, Numerical |
| ⚖️ **Smart Difficulty Split** | Auto 40% Easy · 40% Moderate · 20% Hard |
| 🤖 **RAG-Powered AI** | Questions generated from YOUR document only |
| 📥 **PDF Download** | Print-ready exam paper export via Puppeteer |
| ⚡ **Real-Time Updates** | WebSocket — paper appears without page refresh |
| 🔄 **One-Click Regenerate** | Don't like it? Regenerate instantly |
| 🔑 **Bring Your Own Key** | Supports Groq · Gemini · OpenAI |
| 📱 **Mobile Responsive** | Works perfectly on phone and tablet |
| ✅ **Answer Key Included** | Full model answers for every question |

<br/>

---

## 🧠 LLM Pipeline — How It Works

```
╔══════════════════════════════════════════════════════════════════╗
║                    VEDAFORGE AI PIPELINE                        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║   📄 Teacher uploads PDF                                        ║
║              │                                                   ║
║              ▼                                                   ║
║   ┌─────────────────────────────────────────┐                   ║
║   │         RAG SERVICE  (Python / Render)  │                   ║
║   │                                         │                   ║
║   │  Step 1 ── pypdf reads every page       │                   ║
║   │  Step 2 ── Text split into 800-word     │                   ║
║   │            chunks with 100-word overlap │                   ║
║   │  Step 3 ── Top chunks selected          │                   ║
║   │            (20,000 chars max for Groq)  │                   ║
║   └──────────────────┬──────────────────────┘                   ║
║                      │                                           ║
║                      ▼                                           ║
║   ┌─────────────────────────────────────────┐                   ║
║   │      PROMPT BUILDER  (TypeScript)       │                   ║
║   │                                         │                   ║
║   │  [1] Document content injected FIRST    │                   ║
║   │  [2] "Generate ONLY from this text"     │                   ║
║   │  [3] Question config appended           │                   ║
║   │  [4] Strict JSON schema enforced        │                   ║
║   └──────────────────┬──────────────────────┘                   ║
║                      │                                           ║
║                      ▼                                           ║
║   ┌─────────────────────────────────────────┐                   ║
║   │         GROQ API  (llama-3.3-70b)       │                   ║
║   │                                         │                   ║
║   │  model      llama-3.3-70b-versatile     │                   ║
║   │  temp       0.2  (deterministic)        │                   ║
║   │  format     json_object  (pure JSON)    │                   ║
║   │  tokens     3000 max                    │                   ║
║   │  speed      ~3-4 seconds response       │                   ║
║   └──────────────────┬──────────────────────┘                   ║
║                      │                                           ║
║                      ▼                                           ║
║   ┌─────────────────────────────────────────┐                   ║
║   │       RESPONSE PARSER  (TypeScript)     │                   ║
║   │                                         │                   ║
║   │  ✓ Validates JSON structure             │                   ║
║   │  ✓ Checks exact question counts         │                   ║
║   │  ✓ Verifies difficulty distribution     │                   ║
║   │  ✓ Strips markdown fences if any        │                   ║
║   │  ✗ Rejects malformed output             │                   ║
║   └──────────────────┬──────────────────────┘                   ║
║                      │                                           ║
║         ┌────────────┼────────────┐                             ║
║         ▼            ▼            ▼                             ║
║    MongoDB        Redis        WebSocket                        ║
║    (save paper)   (cache 24h)  (notify frontend)               ║
║         │                          │                            ║
║         └──────────────────────────┘                            ║
║                      │                                           ║
║                      ▼                                           ║
║         📄 Teacher downloads PDF ✅                             ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

<br/>

---

## 🏗️ System Architecture

```
╔══════════════════════════════════════════════════════════════════════╗
║                       SYSTEM ARCHITECTURE                           ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ┌───────────────────────────────────────────────────────────────┐  ║
║  │                        FRONTEND                               │  ║
║  │              Next.js 16 · TypeScript · Zustand               │  ║
║  │                    Deployed on Netlify                        │  ║
║  │                                                               │  ║
║  │  /home → /assignments → /create → /generating → /paper       │  ║
║  │                                                               │  ║
║  │  State: Zustand (assignments, formData, status)               │  ║
║  │  WS Client: socket.io-client → Render Backend URL            │  ║
║  └────────────────────────┬──────────────────────────────────────┘  ║
║                           │  HTTP REST + WebSocket                  ║
║  ┌────────────────────────▼──────────────────────────────────────┐  ║
║  │                        BACKEND                                │  ║
║  │           Node.js · Express · TypeScript                     │  ║
║  │                  Deployed on Render                           │  ║
║  │                                                               │  ║
║  │  POST /api/assignments   → queue job, return fast             │  ║
║  │  GET  /api/assignments   → list all (Redis cached)            │  ║
║  │  POST /api/upload        → multer saves to /uploads           │  ║
║  │  POST /api/settings/llm  → switch AI provider                 │  ║
║  │  WS   notifyDone()       → emit 'paper:ready' event           │  ║
║  └──────────┬──────────────────────────┬───────────────────────  ┘  ║
║             │                          │                             ║
║  ┌──────────▼─────────┐     ┌──────────▼──────────┐               ║
║  │   MongoDB Atlas    │     │     Redis Cloud      │               ║
║  │   (Free Tier)      │     │     (Free Tier)      │               ║
║  │                    │     │                      │               ║
║  │  assignments{}     │     │  BullMQ job queue    │               ║
║  │  papers{}          │     │  Paper cache (24h)   │               ║
║  └────────────────────┘     └──────────┬───────────┘               ║
║                                        │                            ║
║                             ┌──────────▼───────────┐               ║
║                             │    BullMQ Worker      │               ║
║                             │  (runs inside Render  │               ║
║                             │   backend process)    │               ║
║                             │                       │               ║
║                             │  concurrency: 3 jobs  │               ║
║                             │  retries: 3 attempts  │               ║
║                             │  backoff: exponential │               ║
║                             └──────────┬────────────┘               ║
║                                        │                            ║
║                             ┌──────────▼───────────┐               ║
║                             │     RAG SERVICE       │               ║
║                             │  Python Flask         │               ║
║                             │  Deployed on Render   │               ║
║                             │                       │               ║
║                             │  pypdf extraction     │               ║
║                             │  800-word chunking    │               ║
║                             │  20k char context     │               ║
║                             └──────────┬────────────┘               ║
║                                        │                            ║
║                     ┌──────────────────┼──────────────┐             ║
║                     ▼                  ▼              ▼             ║
║               Groq API          Gemini API       OpenAI API        ║
║           (llama-3.3-70b)  (gemini-1.5-flash)  (gpt-4o-mini)     ║
║           DEFAULT / FREE      OPTIONAL            OPTIONAL         ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

<br/>

---

## 🔄 Request Workflow — End to End

```
╔══════════════════════════════════════════════════════════════════════╗
║                    END-TO-END REQUEST FLOW                          ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  TEACHER (Browser)                                                   ║
║      │                                                               ║
║      │  1. Upload PDF  →  POST /api/upload                          ║
║      │                         │                                     ║
║      │                         ▼                                     ║
║      │                  Render Backend                               ║
║      │                  multer saves file                            ║
║      │                  returns { fileId }                           ║
║      │                                                               ║
║      │  2. Submit form →  POST /api/assignments                      ║
║      │                         │                                     ║
║      │                         ▼                                     ║
║      │                  Render Backend                               ║
║      │                  saves assignment to MongoDB                  ║
║      │                  pushes job → Redis (BullMQ)                  ║
║      │                  returns { assignmentId }  ← fast response    ║
║      │                                                               ║
║      │  3. Open /generating page                                     ║
║      │     Connects via WebSocket (socket.io)                        ║
║      │                                                               ║
║      │              ┌── BACKGROUND JOB STARTS ──────────────────┐   ║
║      │              │                                            │   ║
║      │              │  BullMQ Worker (inside Render backend)     │   ║
║      │              │       │                                    │   ║
║      │              │       │  4. POST → RAG Service (Render)    │   ║
║      │              │       │      /extract  { fileId }          │   ║
║      │              │       │           │                        │   ║
║      │              │       │           ▼                        │   ║
║      │              │       │      pypdf reads pages             │   ║
║      │              │       │      splits into 800-word chunks   │   ║
║      │              │       │      selects top 20k chars         │   ║
║      │              │       │      returns { context }           │   ║
║      │              │       │                                    │   ║
║      │              │       │  5. Prompt Builder                 │   ║
║      │              │       │      injects context + config      │   ║
║      │              │       │      enforces JSON schema          │   ║
║      │              │       │                                    │   ║
║      │              │       │  6. POST → Groq API                │   ║
║      │              │       │      llama-3.3-70b-versatile       │   ║
║      │              │       │      temp 0.2, json_object mode    │   ║
║      │              │       │      returns structured JSON       │   ║
║      │              │       │                                    │   ║
║      │              │       │  7. Response Parser                │   ║
║      │              │       │      validates counts & schema     │   ║
║      │              │       │      checks difficulty split       │   ║
║      │              │       │                                    │   ║
║      │              │       │  8. Save to MongoDB (papers{})     │   ║
║      │              │       │     Cache in Redis (24h TTL)       │   ║
║      │              │       │                                    │   ║
║      │              │       │  9. WebSocket emit                 │   ║
║      │              │       │     'paper:ready' { assignmentId } │   ║
║      │              └───────┴────────────────────────────────────┘   ║
║      │                                                               ║
║      │  10. Browser receives 'paper:ready' event                     ║
║      │      Redirects to /assignments/[id]/paper                     ║
║      │                                                               ║
║      │  11. GET /api/assignments/:id                                 ║
║      │      Backend checks Redis cache first                         ║
║      │      Falls back to MongoDB if cache miss                      ║
║      │      Returns full paper JSON                                  ║
║      │                                                               ║
║      │  12. Teacher views formatted paper                            ║
║      │      Downloads PDF (Puppeteer renders HTML → PDF)             ║
║      │      OR clicks Regenerate → repeat from step 2                ║
║      ▼                                                               ║
║  ✅ Done — under 30 seconds total                                    ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

<br/>

---

## 🤖 Agent System — Built with Antigravity

VedaForge was architected and built using a **4-agent system** running on Antigravity:

| Agent | Name | Role | What It Did |
|-------|------|------|-------------|
| 🌐 | **Global Agent** | Project Monitor | Maintained full context across every session. Enforced schema consistency, credentials, architectural decisions, and coding standards throughout |
| 🔍 | **Agent S** | Scraper | Used Firecrawl to scrape `myvedaai.com`. Extracted exact design tokens — colors, fonts, spacing, component inventory — saved to `design-tokens.json` |
| 📝 | **Agent T** | Paper Formatter | Enforced the exact exam paper format. Defined section structure, difficulty tag placement, MCQ option format, answer key layout, and print styling |
| 📄 | **Agent 1** | Data Extractor | Built the complete RAG pipeline — pypdf text extraction, 800-word chunking strategy, context window selection, and Groq prompt injection pattern |

<br/>

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 16, TypeScript | App router, static export, type safety |
| **State** | Zustand | Lightweight, no boilerplate |
| **Styling** | Tailwind CSS | Rapid responsive design |
| **Backend** | Node.js + Express + TypeScript | Fast REST API |
| **Database** | MongoDB Atlas | Flexible document schema |
| **Cache** | Redis Cloud | Job state + 24h paper cache |
| **Queue** | BullMQ | Background AI processing |
| **Real-time** | Socket.io | WebSocket paper-ready events |
| **AI (default)** | Groq llama-3.3-70b | Free, 128k context, fast |
| **AI (optional)** | Gemini 1.5 Flash | Alternative provider |
| **AI (optional)** | GPT-4o Mini | Alternative provider |
| **RAG** | Python Flask + pypdf | PDF text extraction + chunking |
| **PDF Export** | Puppeteer | Print-quality paper download |
| **Frontend Hosting** | Netlify | Static export, free tier |
| **Backend Hosting** | Render | Node.js web service, free tier |
| **RAG Hosting** | Render | Python web service, free tier |

<br/>

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 20+
- Python 3.10+
- MongoDB Atlas — [free tier](https://mongodb.com/atlas)
- Redis Cloud — [free tier](https://redis.com/try-free)
- Groq API key — [free at console.groq.com](https://console.groq.com)

### 1. Clone the repo

```bash
git clone https://github.com/callmegus4444/VedaForge
cd VedaForge
```

### 2. Backend environment

Create `vedaforge/backend/.env`:

```env
MONGODB_URI=mongodb+srv://your_uri
REDIS_URL=redis://your_redis_url:port
PORT=4000
FRONTEND_URL=http://localhost:3000
RAG_SERVICE_URL=http://localhost:5001

# Pick ONE of these — paste your key, set ACTIVE_LLM to match
ACTIVE_LLM=groq

GROQ_API_KEY=your_groq_key        # free at console.groq.com
GEMINI_API_KEY=your_gemini_key    # free at aistudio.google.com
OPENAI_API_KEY=your_openai_key    # platform.openai.com
```

> 💡 **Any LLM works** — Groq is recommended (free + fastest)

### 3. Frontend environment

Create `vedaforge/frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

### 4. Start all services (3 terminals)

```bash
# Terminal 1 — RAG Service
cd vedaforge/rag-service
pip install flask pypdf
python app.py
# ✅ Running on http://127.0.0.1:5001

# Terminal 2 — Backend API + Worker
cd vedaforge/backend
npm install
npm run dev
# ✅ VedaForge backend running on http://localhost:4000

# Terminal 3 — Frontend
cd vedaforge/frontend
npm install
npm run dev
# ✅ Ready on http://localhost:3000
```

### 5. Open and use

```
http://localhost:3000
```

<br/>

---

## 🌍 Deployment

### Frontend → Netlify

```bash
cd vedaforge/frontend
npm run build
# Upload the 'out' folder to Netlify via drag and drop
# netlify.toml is already configured
```

### Backend → Render

1. Go to [render.com](https://render.com)
2. New → **Web Service** → Connect GitHub repo
3. Select the `vedaforge/backend` folder as root
4. Set **Build Command:** `npm install && npm run build`
5. Set **Start Command:** `npm start`
6. Add environment variables (see `.env` above — use your production URLs)
7. Set `FRONTEND_URL` to your Netlify URL
8. Set `RAG_SERVICE_URL` to your Render RAG service URL
9. Deploy

### RAG Service → Render

1. Go to [render.com](https://render.com)
2. New → **Web Service** → Connect GitHub repo
3. Select the `vedaforge/rag-service` folder as root
4. Set **Runtime:** Python 3
5. Set **Build Command:** `pip install -r requirements.txt`
6. Set **Start Command:** `python app.py`
7. Deploy

> ⚠️ **Important:** Render free tier services spin down after inactivity. The first request after a cold start may take ~30–50 seconds. Consider upgrading to a paid plan for production use, or use a cron job to ping the service every 10 minutes to keep it warm.

### Environment variables for production (Render Backend)

```env
MONGODB_URI=mongodb+srv://your_atlas_uri
REDIS_URL=redis://your_redis_cloud_url:port
PORT=10000                                  # Render assigns this automatically
FRONTEND_URL=https://your-app.netlify.app
RAG_SERVICE_URL=https://your-rag-service.onrender.com
ACTIVE_LLM=groq
GROQ_API_KEY=your_groq_key
```

<br/>

---

## 📖 How to Use

```
Step 1  →  Click "Create Assignment"
Step 2  →  Upload a chapter PDF (or skip and describe topic)
Step 3  →  Set the due date
Step 4  →  Add question types (MCQ, Short, Diagram, Numerical)
Step 5  →  Set number of questions and marks per type
Step 6  →  Add any formatting instructions (e.g. "1 hour paper")
Step 7  →  Click Next — generation starts in background
Step 8  →  Watch the real-time generating screen
Step 9  →  Paper appears automatically when ready
Step 10 →  Download as PDF or Regenerate
```

<br/>

---

## 🗂️ Project Structure

```
vedaforge/
├── frontend/                    # Next.js application (Netlify)
│   ├── app/
│   │   ├── assignments/         # Assignment list page
│   │   │   ├── create/          # Create assignment form
│   │   │   └── [id]/
│   │   │       ├── generating/  # Real-time waiting page
│   │   │       └── paper/       # Generated paper view
│   │   ├── groups/              # Coming soon
│   │   ├── library/             # Coming soon
│   │   └── toolkit/             # Coming soon
│   ├── components/              # Reusable UI components
│   ├── hooks/                   # useAssignmentSocket
│   └── store/                   # Zustand state
│
├── backend/                     # Node.js Express API (Render)
│   └── src/
│       ├── routes/              # API endpoints
│       ├── models/              # MongoDB schemas
│       ├── queue/               # BullMQ setup
│       ├── workers/             # Background job processor
│       ├── ai/                  # Groq/Gemini/OpenAI caller
│       │   ├── promptBuilder.ts
│       │   ├── generatePaper.ts
│       │   ├── responseParser.ts
│       │   └── extractFileText.ts
│       ├── config/              # Redis + cache
│       └── websocket/           # Socket.io server
│
└── rag-service/                 # Python RAG microservice (Render)
    ├── app.py                   # Flask server
    └── requirements.txt
```

<br/>

---

## 📄 Generated Paper Format

Every paper VedaForge produces follows this exact structure:

```
Certainly! Here is a customized Question Paper for [Teacher]'s
[Subject] [Class] classes on the [Topic] chapters.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           Delhi Public School, Sector-4
                Subject: Science
                  Class: Grade 8
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Time Allowed: 45 minutes    Maximum Marks: 20

All questions are compulsory unless stated otherwise.

Name: _______________  Roll Number: _______________
Class: ______  Section: ______

                    SECTION A
              Multiple Choice Questions
           Attempt all questions. 1 mark each.

1. [Easy] What is the SI unit of electric current? [1 Mark]
   a) Volt  b) Ampere  c) Ohm  d) Watt

2. [Moderate] State Ohm's law in mathematical form. [1 Mark]

                    SECTION B
                  Short Questions
           Attempt all questions. 2 marks each.

3. [Hard] Explain the difference between series and
          parallel circuits with examples. [2 Marks]

                End of Question Paper

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    ANSWER KEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. b) Ampere is the SI unit of electric current.
2. V = IR, where V = voltage, I = current, R = resistance
3. In series: same current flows through all components...
```

<br/>

---

## ⚙️ API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/assignments` | Create assignment + queue job |
| `GET` | `/api/assignments` | List all assignments |
| `GET` | `/api/assignments/:id` | Get assignment + paper |
| `DELETE` | `/api/assignments/:id` | Delete assignment |
| `POST` | `/api/assignments/:id/retry` | Retry failed generation |
| `POST` | `/api/upload` | Upload PDF/image file |
| `POST` | `/api/settings/llm` | Switch LLM provider |
| `GET` | `RAG /health` | RAG service health check |
| `POST` | `RAG /extract` | Extract + chunk PDF text |

<br/>

---

## ⏱️ Build Timeline

<div align="center">

---

### This complete production-grade application was built in:

# ⏱ 6 hours · 12 minutes · 11 seconds · 92ms

**What was built in that time:**

| Component | Status |
|-----------|--------|
| Next.js frontend with 8+ pages | ✅ |
| Node.js + Express REST API | ✅ |
| BullMQ background job system | ✅ |
| Redis caching layer | ✅ |
| MongoDB Atlas integration | ✅ |
| Python RAG microservice | ✅ |
| Groq AI integration | ✅ |
| Multi-LLM support (Groq/Gemini/OpenAI) | ✅ |
| WebSocket real-time updates | ✅ |
| PDF export via Puppeteer | ✅ |
| Mobile responsive design | ✅ |
| 4-agent Antigravity system | ✅ |
| Deployed: Frontend on Netlify | ✅ |
| Deployed: Backend on Render | ✅ |
| Deployed: RAG Service on Render | ✅ |

---

</div>

<br/>

## 📄 License

MIT — free to use, modify, and distribute.

<br/>

---

<div align="center">

**Built for the VedaAI Full Stack Engineering Assignment**

*Role: Full Stack Engineer · Duration: 6h 12m 11s*

⭐ **Star this repo if VedaForge helped you**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-vedaforge.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://vedaforge.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-callmegus4444%2FVedaForge-black?style=for-the-badge&logo=github)](https://github.com/callmegus4444/VedaForge)

</div>
