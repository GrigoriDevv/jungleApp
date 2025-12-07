import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';

let socket: Socket | null = null;

export const useSocket = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, accessToken } = useAuthStore();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !accessToken) {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      return;
    }

    // Don't create a new socket if one already exists and is connected
    if (socket?.connected) return;

    // Create socket connection
    const wsUrl = (import.meta as any).env['VITE_WS_URL'] || 'http://localhost:3004';
    socket = io(wsUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: accessToken,
      },
    });

    socket.on('connect', () => {
      console.log('WebSocket conectado');
    });

    socket.on('connect_error', (error) => {
      // Silently handle connection errors to avoid console spam
      // Only log if it's not a connection refused error
      if (!error.message.includes('xhr poll error')) {
        console.warn('WebSocket connection error:', error.message);
      }
    });

    socket.on('notification', (data: any) => {
      console.log('Notificação:', data);
    });

    socket.on('task:created', () => queryClient.invalidateQueries({ queryKey: ['tasks'] }));
    socket.on('task:updated', () => queryClient.invalidateQueries({ queryKey: ['tasks'] }));
    socket.on('task:deleted', () => queryClient.invalidateQueries({ queryKey: ['tasks'] }));
    socket.on('comment:added', () => queryClient.invalidateQueries({ queryKey: ['tasks'] }));

    return () => {
      // Only disconnect on unmount, not on every render
      // The socket will be cleaned up when auth state changes
    };
  }, [queryClient, isAuthenticated, accessToken]);
};