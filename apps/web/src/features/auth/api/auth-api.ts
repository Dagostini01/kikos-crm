import type {
  AuthSession,
  LoginInput,
  RegisterInput,
  User,
} from '@/features/auth/model/types';
import { httpClient } from '@/shared/http/client';

type UserResponse = {
  user: User;
};

export const authApi = {
  register(input: RegisterInput) {
    return httpClient.post<AuthSession>('/auth/register', input, {
      auth: false,
    });
  },

  login(input: LoginInput) {
    return httpClient.post<AuthSession>('/auth/login', input, { auth: false });
  },

  logout(refreshToken: string) {
    return httpClient.post<void>(
      '/auth/logout',
      { refreshToken },
      { auth: false },
    );
  },

  me() {
    return httpClient.get<UserResponse>('/auth/me');
  },
};
