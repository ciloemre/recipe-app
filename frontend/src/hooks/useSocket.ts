import { useCallback, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5003";

let sharedSocket: Socket | null = null;
let activeUserId: string | null = null;

function joinRoom(socket: Socket) {
  if (!socket.connected || !activeUserId) return;
  socket.emit("authenticate", activeUserId);
  socket.emit("joinUserRoom", activeUserId);
}

function getSharedSocket() {
  if (!sharedSocket) {
    sharedSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 10000,
    });
    sharedSocket.on("connect", () => {
      if (sharedSocket) joinRoom(sharedSocket);
    });
  }
  return sharedSocket;
}

export function bindSocketUser(userId?: string | null) {
  activeUserId =
    userId && /^[a-f\d]{24}$/i.test(userId) ? userId : null;
  joinRoom(getSharedSocket());
}

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(
    () => getSharedSocket().connected
  );

  useEffect(() => {
    const socket = getSharedSocket();
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    setIsConnected(socket.connected);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  const emit = useCallback((eventName: string, data: unknown) => {
    const socket = getSharedSocket();
    if (socket.connected) {
      socket.emit(eventName, data);
    }
  }, []);

  const on = useCallback(
    (eventName: string, callback: (data: any) => void) => {
      getSharedSocket().on(eventName, callback);
    },
    []
  );

  const off = useCallback(
    (eventName: string, callback: (data: any) => void) => {
      getSharedSocket().off(eventName, callback);
    },
    []
  );

  const subscribeConnect = useCallback((handler: () => void) => {
    const socket = getSharedSocket();
    socket.on("connect", handler);
    if (socket.connected) handler();
    return () => {
      socket.off("connect", handler);
    };
  }, []);

  return { emit, on, off, isConnected, subscribeConnect };
};
