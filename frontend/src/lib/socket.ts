"use client";

import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getNotificationSocket(token: string): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000", {
      autoConnect: false,
      auth: { token },
      transports: ["websocket"],
    });
  } else {
    socket.auth = { token };
  }
  return socket;
}

export function disconnectNotificationSocket(): void {
  socket?.disconnect();
  socket = null;
}
