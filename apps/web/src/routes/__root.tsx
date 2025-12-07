import { useSocket } from '@/hooks/useSocket';
import { createRootRoute, Outlet, ErrorComponent } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => {
    useSocket(); // ← ativa o realtime global
    return <Outlet />;
  },
  errorComponent: ({ error }) => {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  },
});