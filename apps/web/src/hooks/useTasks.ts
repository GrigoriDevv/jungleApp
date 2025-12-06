import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  dueDate: z.string().optional(), // Assuming ISO date
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
  assignees: z.array(z.string()).optional(),
});

type TaskData = z.infer<typeof taskSchema>;
type Task = TaskData & { id: string };
type TaskResponse = { data: Task };
type TasksResponse = { data: Task[] };

export const useTasks = (page: number = 1, size: number = 10) => {
  return useQuery<Task[]>({
    queryKey: ['tasks', page, size],
    queryFn: () => api.get(`/tasks?page=${page}&size=${size}`).then((res: TasksResponse) => res.data),
  });
};

export const useTask = (id: string) => {
  return useQuery<Task>({
    queryKey: ['task', id],
    queryFn: () => api.get(`/tasks/${id}`).then((res: TaskResponse) => res.data),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskData) => api.post('/tasks', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

export const useUpdateTask = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TaskData>) => api.put(`/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', id] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

export const useTaskForm = (defaultValues?: Partial<TaskData>) =>
  useForm<TaskData>({ resolver: zodResolver(taskSchema), defaultValues });