import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const commentSchema = z.object({
  content: z.string().min(1),
});

type CommentData = z.infer<typeof commentSchema>;
type Comment = CommentData & { id: string; createdAt: string; user: string };
type CommentsResponse = { data: Comment[] };

export const useComments = (taskId: string, page: number = 1, size: number = 10) => {
  return useQuery<Comment[]>({
    queryKey: ['comments', taskId, page, size],
    queryFn: () => api.get(`/tasks/${taskId}/comments?page=${page}&size=${size}`).then((res: CommentsResponse) => res.data),
  });
};

export const useCreateComment = (taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CommentData) => api.post(`/tasks/${taskId}/comments`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', taskId] }),
  });
};

export const useCommentForm = () => useForm<CommentData>({ resolver: zodResolver(commentSchema) });