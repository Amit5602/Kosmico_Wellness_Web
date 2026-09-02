import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

export const useSocket = () => {
  const { accessToken, isAuthenticated } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Initialize socket connection
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token: accessToken },
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        console.log('Socket.IO Connected');
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket.IO Disconnected');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket.IO Connection Error:', error);
      });
    }

    return () => {
      // Don't disconnect on unmount, we want a persistent connection for the provider.
      // Connection lifecycle is tied to authentication status.
    };
  }, [isAuthenticated, accessToken]);

  return {
    socket: socketRef.current,
    isConnected,
  };
};
