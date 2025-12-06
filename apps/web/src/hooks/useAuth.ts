import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from '@tanstack/react-router';
import { connectWebSocket } from '../lib/ws';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;

type LoginResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: RegisterData) => api.post('/auth/register', data),
    onSuccess: () => navigate({ to: '/login' }),
  });
};

export const useLogin = () => {
  const { setTokens } = useAuthStore();
  const navigate = useNavigate();
  return useMutation<LoginResponse, unknown, LoginData>({
    mutationFn: (data: LoginData) => api.post('/auth/login', data),
    onSuccess: (res) => {
      setTokens(res.data.accessToken, res.data.refreshToken);
      connectWebSocket();
      navigate({ to: '/tasks' });
    },
  });
};

export const useRegisterForm = () => useForm<RegisterData>({ resolver: zodResolver(registerSchema) });
export const useLoginForm = () => useForm<LoginData>({ resolver: zodResolver(loginSchema) });