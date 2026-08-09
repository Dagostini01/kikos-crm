import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { authApi } from '@/features/auth/api/auth-api';
import type { LoginInput, RegisterInput, User } from '@/features/auth/model/types';
import { tokenStore } from '@/features/auth/session/token-store';
import { getErrorMessage } from '@/shared/http/errors';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);

  const bootstrap = useCallback(async () => {
    const refreshToken = tokenStore.getRefreshToken();

    if (!refreshToken) {
      setUser(null);
      setStatus('unauthenticated');
      return;
    }

    try {
      const { user: currentUser } = await authApi.me();
      setUser(currentUser);
      setStatus('authenticated');
    } catch {
      tokenStore.clear();
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const applySession = useCallback((session: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => {
    tokenStore.setSession({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
    setUser(session.user);
    setStatus('authenticated');
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      const session = await authApi.login(input);
      applySession(session);
    },
    [applySession],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const session = await authApi.register(input);
      applySession(session);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    const refreshToken = tokenStore.getRefreshToken();

    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.warn(getErrorMessage(error, 'Falha ao encerrar sessão na API'));
    } finally {
      tokenStore.clear();
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  const value = useMemo(
    () => ({
      status,
      user,
      login,
      register,
      logout,
    }),
    [status, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
