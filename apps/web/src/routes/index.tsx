// apps/web/src/routes/index.tsx
// Página principal (/): Lista de tarefas com filtros, busca, paginação, skeletons e proteção de autenticação

import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Calendar, Users } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const searchSchema = z.object({
  page: z.number().min(1).default(1),
  size: z.number().min(10).max(50).default(20),
  q: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
})

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: '/' },
      })
    }
  },
  component: TasksIndex,
})

function TasksIndex() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: search.page.toString(),
        size: search.size.toString(),
        ...(search.q && { q: search.q }),
        ...(search.status && { status: search.status }),
        ...(search.priority && { priority: search.priority }),
      })

      const res = await api.get(`/tasks?${params}`)
      return res.data // { tasks: Task[], pagination: { total: number, pages: number } }
    },
  })

  const setSearch = (updates: Partial<z.infer<typeof searchSchema>>) => {
    navigate({ search: (prev) => ({ ...prev, ...updates, page: updates.page ?? 1 }) })
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Minhas Tarefas</h1>
        <Button asChild size="lg">
          <Link to={"/tasks/create" as any} preload={false}>
            <Plus className="w-5 h-5 mr-2" />
            Nova Tarefa
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <Input
          placeholder="Buscar por título ou descrição..."
          value={search.q ?? ''}
          onChange={(e) => setSearch({ q: e.target.value || undefined })}
          className="md:max-w-sm"
        />
        <Select value={search.status ?? ''} onValueChange={(v) => setSearch({ status: (v || undefined) as 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | undefined })}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os status</SelectItem>
            <SelectItem value="TODO">A fazer</SelectItem>
            <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
            <SelectItem value="REVIEW">Revisão</SelectItem>
            <SelectItem value="DONE">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <Select value={search.priority ?? ''} onValueChange={(v) => setSearch({ priority: (v || undefined) as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | undefined })}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as prioridades</SelectItem>
            <SelectItem value="LOW">Baixa</SelectItem>
            <SelectItem value="MEDIUM">Média</SelectItem>
            <SelectItem value="HIGH">Alta</SelectItem>
            <SelectItem value="URGENT">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de tarefas */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data?.tasks?.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-xl text-muted-foreground">Nenhuma tarefa encontrada</p>
          <Button asChild className="mt-6">
            <Link to={"/tasks/create" as any}>Criar primeira tarefa</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.tasks.map((task: any) => (
            <Link key={task.id} to={`/tasks/${task.id}` as any} className="block group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-3">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {task.title}
                    </CardTitle>
                    <Badge
                      variant={
                        task.priority === 'URGENT'
                          ? 'destructive'
                          : task.priority === 'HIGH'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {task.priority === 'URGENT' ? 'Urgente' : task.priority === 'HIGH' ? 'Alta' : task.priority === 'MEDIUM' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {task.description || 'Sem descrição'}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline" className="text-xs">
                      {task.status === 'TODO'
                        ? 'A fazer'
                        : task.status === 'IN_PROGRESS'
                        ? 'Em andamento'
                        : task.status === 'REVIEW'
                        ? 'Revisão'
                        : 'Concluído'}
                    </Badge>

                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(task.dueDate), 'dd MMM', { locale: ptBR })}
                      </div>
                    )}
                  </div>

                  {task.assigneeIds?.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <div className="flex -space-x-2">
                        {task.assignees?.slice(0, 4).map((assignee: any) => (
                          <Avatar key={assignee.id} className="w-7 h-7 border-2 border-background">
                            <AvatarFallback className="text-xs">
                              {assignee.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {task.assigneeIds.length > 4 && (
                          <Avatar className="w-7 h-7 border-2 border-background">
                            <AvatarFallback className="text-xs">
                              +{task.assigneeIds.length - 4}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Paginação */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-12">
          <Button
            variant="outline"
            disabled={search.page === 1}
            onClick={() => setSearch({ page: search.page - 1 })}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {search.page} de {data.pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={search.page === data.pagination.pages}
            onClick={() => setSearch({ page: search.page + 1 })}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}