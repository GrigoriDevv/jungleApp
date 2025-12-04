import { io } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';

const socket = io('/', { // Assuming WebSocket on same origin via gateway
  autoConnect: false,
});

socket.on('connect', () => {
  console.log('WebSocket connected');
});

export const connectWebSocket = () => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
};

export const disconnectWebSocket = () => {
  socket.disconnect();
};

export default socket;