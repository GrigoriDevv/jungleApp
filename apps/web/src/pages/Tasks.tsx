import { useState, useEffect } from 'react';
import { useTasks, useCreateTask, useDeleteTask, useTaskForm } from '../hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Link } from '@tanstack/react-router';
import socket from '../lib/ws';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'; // For create modal

export const Tasks = () => {
  const [page, setPage] = useState(1);
  const { data: tasks, isLoading } = useTasks(page);
  const { mutate: createTask } = useCreateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { register, handleSubmit } = useTaskForm();
  const { toast } = useToast();

  useEffect(() => {
    socket.on('task:created', () => toast({ title: 'New task created' }));
    socket.on('task:updated', () => toast({ title: 'Task updated' }));

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
    };
  }, []);

  const onSubmit = (data) => createTask(data);

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="p-4">
      <h1 className="text-2xl">Tasks</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create Task</Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Title" {...register('title')} />
            <Input placeholder="Description" {...register('description')} />
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
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
      <ul>
        {tasks?.map((task) => (
          <li key={task.id} className="flex justify-between">
            <Link to={`/tasks/${task.id}`}>{task.title}</Link>
            <Button variant="destructive" onClick={() => deleteTask(task.id)}>Delete</Button>
          </li>
        ))}
      </ul>
      <Button onClick={() => setPage((p) => p + 1)}>Next Page</Button>
    </div>
  );
};