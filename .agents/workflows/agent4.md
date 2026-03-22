---
description: Set up the background job system. This is what makes the API fast — heavy AI work happens here, not in the request handler.
---

Build the BullMQ queue and worker system in vedaforge/backend/.
This runs separately from the Express API.
■■ 1. INSTALL ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
npm install bullmq ioredis
■■ 2. REDIS CONNECTION ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
File: src/config/redis.ts
import IORedis from 'ioredis'
export const redisConnection = new IORedis(process.env.REDIS_URL)
Handle connection errors gracefully with console.error
■■ 3. QUEUE SETUP ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
File: src/queue/assignmentQueue.ts
- Create a Queue named 'assignment-generation'
- Export function: addGenerationJob(assignmentId, data)
that adds a job with { assignmentId, questionTypes,
instructions, fileUrl }
- Job options: attempts: 3, backoff: { type: 'exponential', delay: 2000 }
■■ 4. WORKER ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
File: src/workers/generationWorker.ts
Create a Worker on 'assignment-generation' queue.
Inside the worker process function:
Step A: Update Assignment status to 'processing' in MongoDB
Step B: Call generateQuestionPaper(job.data) from the AI module
(you will build this in Step Agent 5)
Step C: Save the result to GeneratedPaper collection
Step D: Update Assignment status to 'done'
Step E: Emit WebSocket event { assignmentId, status: 'done' }
(you will connect WebSocket in Step Agent 6)
On error:
- Update Assignment status to 'error'
- Log the error with assignment ID
■■ 5. CACHING WITH REDIS ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
File: src/config/cache.ts
- Function: getCachedPaper(assignmentId) → checks Redis first
- Function: setCachedPaper(assignmentId, paperData)
- TTL: 24 hours (86400 seconds)
- In GET /api/assignments/:id, check cache before hitting MongoDB
■■ 6. WORKER ENTRY POINT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
File: src/workers/index.ts
- Import and start the worker
- This file is run separately: node src/workers/index.js
- Add to package.json scripts:
'worker': 'ts-node src/workers/index.ts'
■■ 7. HOW TO RUN ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Terminal 1: npm run dev (Express API)
Terminal 2: npm run worker (BullMQ worker)
Terminal 3: redis-server (Redis)
Test it: POST to /api/assignments and check MongoDB
status changes from pending → processing → done
