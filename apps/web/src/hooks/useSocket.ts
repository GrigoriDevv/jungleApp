import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (socket) return;

    socket = io((import.meta as any).env.VITE_WS_URL || 'http://localhost:3004', {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('WebSocket conectado');
    });

    socket.on('notification', (data: any) => {
      // Toast bonitão
      // toast(data.message);
      console.log('Notificação:', data);
    });

    socket.on('task:created', () => queryClient.invalidateQueries({ queryKey: ['tasks'] }));
    socket.on('task:updated', () => queryClient.invalidateQueries({ queryKey: ['tasks'] }));
    socket.on('task:deleted', () => queryClient.invalidateQueries({ queryKey: ['tasks'] }));
    socket.on('comment:added', () => queryClient.invalidateQueries({ queryKey: ['tasks'] }));

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [queryClient]);
};