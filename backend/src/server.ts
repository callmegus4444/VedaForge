import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

import assignmentRoutes from './routes/assignments';
import uploadRoutes from './routes/upload';
import pdfRoutes from './routes/pdf';
import settingsRoutes from './routes/settings';
import { initWebSocket } from './websocket/wsServer';

const app = express();
const PORT = parseInt(process.env.PORT ?? '4000', 10);
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const MONGODB_URI = process.env.MONGODB_URI ?? '';

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/assignments', assignmentRoutes);
app.use('/api/assignments', pdfRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── HTTP Server (needed for Socket.io) ──────────────────────────────────────
const httpServer = http.createServer(app);

// ── MongoDB connect + start ────────────────────────────────────────────────
async function main() {
  if (!MONGODB_URI) {
    console.error('❌  MONGODB_URI is not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB ?? 'vedaforge',
    });
    console.log('✅  MongoDB connected');
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err);
    process.exit(1);
  }

  // Attach WebSocket to HTTP server
  initWebSocket(httpServer, FRONTEND_URL);

  httpServer.listen(PORT, () => {
    console.log(`🚀  VedaForge backend running on http://localhost:${PORT}`);
  });
}

main();
