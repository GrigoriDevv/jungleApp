import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { routeTree } from './routeTree.gen';

import './styles.css';

const queryClient = new QueryClient();

// Cria o router
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: { queryClient },
});

// Registra o router para tipagem
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Renderiza a aplicação
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <RouterProvider router={router} />
          <Toaster />
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);