import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ location }) => {
    // Se não tiver token, manda pro login
    if (!useAuthStore.getState().token) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-white border-b">
        <div className="container mx-auto flex justify-between">
          <h1 className="font-bold">Jungle Tasks</h1>
          <button onClick={() => useAuthStore.getState().logout()}>Sair</button>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  ),
});