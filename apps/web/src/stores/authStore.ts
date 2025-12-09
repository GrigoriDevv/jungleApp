// apps/web/src/stores/authStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface AuthState {
  user: {
    id: string
    email: string
    username: string
  } | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  refresh: () => Promise<void>
  logout: () => void
  setTokens: (accessToken: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/login', { email, password })
          const { accessToken, refreshToken, user } = res.data
          set({ user, accessToken, refreshToken, isAuthenticated: true })
          toast.success('Login realizado com sucesso!')
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Erro no login')
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (email, username, password) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/register', { email, username, password })
          const { accessToken, refreshToken, user } = res.data
          set({ user, accessToken, refreshToken, isAuthenticated: true })
          toast.success('Conta criada com sucesso!')
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Erro no registro')
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      refresh: async () => {
        const { refreshToken } = get()
        if (!refreshToken) return

        try {
          set({ isLoading: true })
          const res = await api.post('/auth/refresh', { refreshToken })
          const { accessToken, refreshToken: newRefresh } = res.data
          set({ accessToken, refreshToken: newRefresh })
          toast.info('Sessão renovada automaticamente')
        } catch (error) {
          get().logout()
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
        toast.success('Logout realizado!')
      },

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken })
      },
    }),
    {
      name: 'auth-storage', // chave no localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ // só persiste tokens, não user para segurança
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

// Hook customizado para usar em componentes (facilita)
export const useAuth = () => {
  const auth = useAuthStore()
  return auth
}