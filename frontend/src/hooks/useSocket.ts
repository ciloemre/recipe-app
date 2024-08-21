import { useState, useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5003";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to Socket.IO server");
        setIsConnected(true);
        reconnectAttempts.current = 0;
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("Disconnected from Socket.IO server:", reason);
        setIsConnected(false);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error);
        setIsConnected(false);
        reconnectAttempts.current++;
        if (reconnectAttempts.current > 5) {
          socketRef.current?.disconnect();
        }
      });
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connect]);

  const emit = useCallback(
    (eventName: string, data: any) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit(eventName, data);
      } else {
        console.warn(
          "Socket is not connected. Unable to emit event:",
          eventName
        );
      }
    },
    [isConnected]
  );

  const on = useCallback((eventName: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback);
    }
  }, []);

  const off = useCallback(
    (eventName: string, callback: (data: any) => void) => {
      if (socketRef.current) {
        socketRef.current.off(eventName, callback);
      }
    },
    []
  );

  return { emit, on, off, isConnected };
};
