import { useLogin, useLoginForm } from '../hooks/useAuth';
import type { LoginData } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Link } from '@tanstack/react-router';

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useLoginForm();
  const { mutate, isPending } = useLogin();
  const { toast } = useToast();

  const onSubmit = (data: LoginData) => mutate(data, { onError: () => toast({ title: 'Login failed', variant: 'destructive' }) });
  if (isPending) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-80">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register('email')} />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <Button type="submit">Login</Button>
        <Link to="/register">Register</Link>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
  Não tem conta?{' '}
  <Link to="/register" className="text-primary hover:underline font-medium">
    Criar conta
  </Link>
</p>
    </div>
  );
};