import { useSocket } from '@/hooks/useSocket';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';

export const Route = createRootRoute({
  component: () => {
    useSocket(); // ← ativa o realtime global
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  },
});