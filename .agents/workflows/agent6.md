---
description: Wire up the real-time notification system and build the final question paper view. This is the output the teacher actually sees.
---

This is the final integration step. Wire WebSocket and build
the question paper output page.
■■ BACKEND: WEBSOCKET SERVER ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
File: backend/src/websocket/wsServer.ts
npm install socket.io
- Create Socket.io server attached to the Express HTTP server
- Export function: notifyDone(assignmentId: string)
that emits to all connected clients:
socket.emit('paper:ready', { assignmentId })
- Call notifyDone() from the BullMQ worker in Step 4
after saving GeneratedPaper to MongoDB
■■ FRONTEND: WEBSOCKET HOOK ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
File: frontend/hooks/useAssignmentSocket.ts
npm install socket.io-client
- Connect to backend WebSocket on mount
- Listen for 'paper:ready' event
- Accept a callback: onReady(assignmentId: string)
- Disconnect on unmount
■■ FRONTEND: GENERATING PAGE ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
File: frontend/app/assignments/[id]/generating/page.tsx
- Show a loading spinner + 'Generating your question paper...'
- Use useAssignmentSocket hook
- When 'paper:ready' fires with matching assignmentId:
router.push('/assignments/[id]/paper')
■■ FRONTEND: QUESTION PAPER PAGE ■■■■■■■■■■■■■■■■■■■■■■■■■
File: frontend/app/assignments/[id]/paper/page.tsx
Fetch GeneratedPaper by assignmentId.
Render the following layout (match Figma screenshot):
HEADER SECTION:
School name (bold, centered, large)
Subject: [subject] Class: [class]
Time Allowed: 45 minutes Maximum Marks: [total]
'All questions are compulsory unless stated otherwise.'
STUDENT INFO:
Name: ___________ Roll Number: ___________
Class: ___ Section: ___
QUESTION SECTIONS:
For each section in sections[]:
- Section title (bold, e.g. 'Section A')
- Instruction line (italic)
- Numbered questions
- Each question: number + text + difficulty badge + marks
- Difficulty badges:
Easy → green background
Moderate → amber background
Hard → red background
ACTION BAR (top right):
- 'Download as PDF' button
- 'Regenerate' button (calls POST /api/assignments/:id/regenerate)
■■ FRONTEND: PDF EXPORT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Option A (recommended): Backend PDF generation
- POST /api/assignments/:id/pdf
- Backend uses Puppeteer to render the paper page as PDF
- Return as downloadable file
- npm install puppeteer
Option B (simpler): react-pdf on frontend
- npm install @react-pdf/renderer
- Create a PDFDocument component mirroring the paper layout
■■ FINAL CHECKLIST ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
- [ ] Form submits and gets a jobId back
- [ ] Browser shows 'Generating...' page
- [ ] WebSocket fires when worker finishes
- [ ] Paper page renders all sections + questions
- [ ] Difficulty badges show correct colors
- [ ] PDF download works and looks like a real exam paper
- [ ] Mobile responsive
