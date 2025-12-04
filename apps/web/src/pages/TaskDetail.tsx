import { useParams } from '@tanstack/react-router';
import { useTask, useUpdateTask, useTaskForm } from '../hooks/useTasks';
import { useComments, useCreateComment, useCommentForm } from '../hooks/useComments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import socket from '../lib/ws';
import { useToast } from '@/components/ui/use-toast';

export const TaskDetail = () => {
  const { id } = useParams({from: '/tasks/$id'});
  const { data: task, isLoading } = useTask(id);
  const { mutate: updateTask } = useUpdateTask(id);
  const { register, handleSubmit, reset } = useTaskForm(task);
  const { data: comments } = useComments(id);
  const { mutate: createComment } = useCreateComment(id);
  const { register: regComment, handleSubmit: handleComment } = useCommentForm();
  const { toast } = useToast();

  useEffect(() => {
    if (task) reset(task);
  }, [task, reset]);

  useEffect(() => {
    socket.on('comment:new', () => toast({ title: 'New comment' }));

    return () => socket.off('comment:new');
  }, []);

  const onSubmit = (data) => updateTask(data);
  const onCommentSubmit = (data) => createComment(data);

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="p-4">
      <h1 className="text-2xl">{task?.title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input {...register('title')} />
        <Input {...register('description')} />
        <Input type="date" {...register('dueDate')} />
        <Select {...register('priority')}>
          <option>LOW</option>
          <option>MEDIUM</option>
          <option>HIGH</option>
          <option>URGENT</option>
        </Select>
        <Select {...register('status')}>
          <option>TODO</option>
          <option>IN_PROGRESS</option>
          <option>REVIEW</option>
          <option>DONE</option>
        </Select>
        <Button type="submit">Update</Button>
      </form>
      <h2>Comments</h2>
      <ul>
        {comments?.map((comment) => (
          <li key={comment.id}>{comment.content} - {comment.user}</li>
        ))}
      </ul>
      <form onSubmit={handleComment(onCommentSubmit)}>
        <Input placeholder="Add comment" {...regComment('content')} />
        <Button type="submit">Post</Button>
      </form>
    </div>
  );
};