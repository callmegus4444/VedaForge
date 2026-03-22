---
description: Build the API server. This is the backbone — it receives form data, saves to MongoDB, and kicks off the background job.
---

 1. PROJECT SETUP 
Run these commands first:
cd vedaforge/backend
npm init -y
npm install express mongoose dotenv cors multer
npm install -D typescript @types/express @types/node ts-node nodemon
 2. MONGOOSE SCHEMAS 
File: src/models/Assignment.ts
_id, title (String), dueDate (Date),
questionTypes: [{ type, count, marks }],
fileUrl (String, optional),
instructions (String),
status: 'pending' | 'processing' | 'done' | 'error',
createdAt (Date, default now)
File: src/models/GeneratedPaper.ts
assignmentId (ObjectId ref Assignment),
sections: [{ title, instruction,
questions: [{ text, difficulty, marks }] }],
generatedAt (Date)
 3. API ROUTES 
File: src/routes/assignments.ts
POST /api/assignments
- Receive: { title, dueDate, questionTypes[], instructions, fileUrl? }
- Save Assignment to MongoDB with status: 'pending'
- Add job to BullMQ queue (import from queue module)
- Return: { success: true, assignmentId, jobId }
- IMPORTANT: respond in under 200ms — do NOT wait for AI
GET /api/assignments
- Return all assignments sorted by createdAt desc
- Include status field so frontend can show pending/done
GET /api/assignments/:id
- Return assignment + its GeneratedPaper (if exists)
DELETE /api/assignments/:id
- Delete assignment + its GeneratedPaper
 4. FILE UPLOAD ENDPOINT 
POST /api/upload
- Use multer for file handling
- Save to uploads/ folder
- Return: { fileUrl: '/uploads/filename.pdf' }
 5. SERVER SETUp
File: src/server.ts
- Express app with cors, json body parser
- Mount routes at /api
- Connect to MongoDB (MONGODB_URI from .env)
- Listen on PORT from .env (default 4000)
6. ENV VARIABLES NEEDED 
Create vedaforge/backend/.env:
MONGODB_URI=mongodb://localhost:27017/vedaforge
PORT=4000
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=your_key_here
FRONTEND_URL=http://localhost:3000
 7. ERROR HANDLING 
All routes must have try/catch.
Return { success: false, error: message } on failure.
Use HTTP status codes correctly (400 for bad input, 500 for server error).