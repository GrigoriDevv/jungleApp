import { createFileRoute } from '@tanstack/react-router';
import { useLogin, useLoginForm } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useLoginForm();
  const { mutate, isPending } = useLogin();
  const { toast } = useToast();

  const onSubmit = (data: { email: string; password: string }) => {
    mutate(data, {
      onError: () => toast({ title: 'Login failed', variant: 'destructive' }),
    });
  };

  if (isPending) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="seu@email.com" {...register('email')} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}