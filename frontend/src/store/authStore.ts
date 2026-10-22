import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';

export type UserRole = 'superAdmin' | 'hospitalAdmin' | 'receptionist' | 'doctor' | 'patient';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(email, password);
          const { tokens, user } = res.data.data;

          localStorage.setItem('mv_access_token', tokens.accessToken);
          localStorage.setItem('mv_refresh_token', tokens.refreshToken);

          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isLoading: false,
          });
        } catch (err: unknown) {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Login failed. Please check your credentials.';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Always clear local state even if server call fails
        }
        localStorage.removeItem('mv_access_token');
        localStorage.removeItem('mv_refresh_token');
        set({ user: null, accessToken: null, refreshToken: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'medivoice-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

// ─── Role helpers ─────────────────────────────────────────────────────────
export const useCurrentUser = () => useAuthStore((s) => s.user);
export const useIsRole = (role: UserRole) => useAuthStore((s) => s.user?.role === role);
