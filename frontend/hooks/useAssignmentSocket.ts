"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://vedaforge-backend.onrender.com";

export function useAssignmentSocket(
  onReady: (assignmentId: string) => void
) {
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const socket: Socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
    });

    socket.on("paper:ready", (data: { assignmentId: string }) => {
      console.log("[Socket] paper:ready received:", data.assignmentId);
      onReadyRef.current(data.assignmentId);
    });

    socket.on("disconnect", () => {
      console.log("[Socket] Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}
