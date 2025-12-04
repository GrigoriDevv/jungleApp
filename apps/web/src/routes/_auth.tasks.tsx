import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Definição da rota
export const Route = createFileRoute('/_auth/tasks')({
  component: TasksPage,
});

// Tipagem básica (deveria vir do pacote @packages/types)
type Task = {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'HIGH';
};

function TasksPage() {
  // Fetcher
  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      // const { data } = await api.get<Task[]>('/tasks');
      // return data;
      
      // Mock para visualização imediata
      return [
        { id: '1', title: 'Configurar Docker', status: 'DONE', priority: 'HIGH' },
        { id: '2', title: 'Criar UI de Tarefas', status: 'IN_PROGRESS', priority: 'MEDIUM' },
      ] as Task[];
    },
  });

  if (isLoading) return <TasksSkeleton />;
  if (isError) return <div>Erro ao carregar tarefas.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Suas Tarefas</h2>
        {/* Aqui viria o botão de Nova Tarefa + Modal */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks?.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {task.title}
              </CardTitle>
              <Badge variant={task.status === 'DONE' ? 'default' : 'secondary'}>
                {task.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground mt-2">
                Prioridade: <span className="font-bold">{task.priority}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TasksSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
      ))}
    </div>
  );
}