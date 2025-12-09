import { useRegister, useRegisterForm } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Link } from '@tanstack/react-router';

export const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useRegisterForm();
  const { mutate, isPending } = useRegister();
  const { toast } = useToast();

  const onSubmit = (data) => mutate(data, { onError: () => toast({ title: 'Registration failed', variant: 'destructive' }) });

  if (isPending) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="flex b items-center justify-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className=" bg-foreground space-y-4 w-80">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder='Email' {...register('email')} />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder='username'{...register('username')} />
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder='Senha' {...register('password')} />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <Button type="submit">Register</Button>
        <Link to="/login">Login</Link>
      </form>
    </div>
  );
};