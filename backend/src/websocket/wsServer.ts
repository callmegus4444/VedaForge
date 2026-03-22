import { Server as HTTPServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';

let io: SocketServer | null = null;

export function initWebSocket(httpServer: HTTPServer, corsOrigin: string): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: [corsOrigin, 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[WS] Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`[WS] Client disconnected: ${socket.id}`);
    });
  });

  console.log('✅  WebSocket server initialized');
  return io;
}

/**
 * Emit 'paper:ready' to ALL connected clients.
 * Called by the BullMQ worker after saving GeneratedPaper.
 */
export function notifyDone(assignmentId: string): void {
  if (!io) {
    console.warn('[WS] notifyDone called but socket server not initialized');
    return;
  }
  io.emit('paper:ready', { assignmentId });
  console.log(`[WS] Emitted paper:ready for ${assignmentId}`);
}
