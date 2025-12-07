import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCreateTask, useTaskForm } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export const Route = createFileRoute('/_auth/tasks/create')({
  component: CreateTaskPage,
});

function CreateTaskPage() {
  const navigate = useNavigate();
  const { mutate: createTask, isPending } = useCreateTask();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useTaskForm();
  const { toast } = useToast();

  const onSubmit = (data: any) => {
    createTask(data, {
      onSuccess: () => {
        toast({ title: 'Tarefa criada com sucesso!' });
        navigate({ to: '/tasks' });
      },
      onError: () => {
        toast({ title: 'Erro ao criar tarefa', variant: 'destructive' });
      },
    });
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Nova Tarefa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" {...register('description')} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input id="dueDate" type="date" {...register('dueDate')} />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>}
            </div>

            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={watch('priority') || ''}
                onValueChange={(value) => setValue('priority', value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status') || ''}
                onValueChange={(value) => setValue('status', value as 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE')}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">A fazer</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
                  <SelectItem value="REVIEW">Revisão</SelectItem>
                  <SelectItem value="DONE">Concluído</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Criando...' : 'Criar Tarefa'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/tasks' })}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
