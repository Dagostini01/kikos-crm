import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildApp } from '@/app.js';
import { hashRefreshToken } from '@/cryptography/refresh-token.js';
import type { Database } from '@/lib/prisma.js';
import { AuthenticateUserUseCase } from '@/use-cases/auth/authenticate-user.js';
import { GetProfileUseCase } from '@/use-cases/auth/get-profile.js';
import { LogoutUserUseCase } from '@/use-cases/auth/logout-user.js';
import { RefreshAccessTokenUseCase } from '@/use-cases/auth/refresh-access-token.js';
import { RegisterUserUseCase } from '@/use-cases/auth/register-user.js';
import { authHeader } from './helpers/auth.js';
import {
  resetTestAuthRepository,
  testCreateAuthSession,
  testHasher,
  testRefreshTokensRepository,
  testUsersRepository,
} from './helpers/test-auth-repository.js';

vi.mock('@/use-cases/auth/factories/make-register-user-use-case.js', () => ({
  makeRegisterUserUseCase: () =>
    new RegisterUserUseCase(
      testUsersRepository,
      testHasher,
      testCreateAuthSession,
    ),
}));
vi.mock(
  '@/use-cases/auth/factories/make-authenticate-user-use-case.js',
  () => ({
    makeAuthenticateUserUseCase: () =>
      new AuthenticateUserUseCase(
        testUsersRepository,
        testHasher,
        testCreateAuthSession,
      ),
  }),
);
vi.mock(
  '@/use-cases/auth/factories/make-refresh-access-token-use-case.js',
  () => ({
    makeRefreshAccessTokenUseCase: () =>
      new RefreshAccessTokenUseCase(
        testUsersRepository,
        testRefreshTokensRepository,
        testCreateAuthSession,
      ),
  }),
);
vi.mock('@/use-cases/auth/factories/make-logout-user-use-case.js', () => ({
  makeLogoutUserUseCase: () =>
    new LogoutUserUseCase(testRefreshTokensRepository),
}));
vi.mock('@/use-cases/auth/factories/make-get-profile-use-case.js', () => ({
  makeGetProfileUseCase: () => new GetProfileUseCase(testUsersRepository),
}));

function createDatabaseMock(): Database {
  return {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    ping: vi.fn().mockResolvedValue(undefined),
  };
}

const apps: FastifyInstance[] = [];

async function createApp() {
  const app = await buildApp({ database: createDatabaseMock() });
  apps.push(app);
  return app;
}

async function registerUser(
  app: FastifyInstance,
  overrides: Partial<{ name: string; email: string; password: string }> = {},
) {
  return app.inject({
    method: 'POST',
    url: '/auth/register',
    payload: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
      ...overrides,
    },
  });
}

beforeEach(resetTestAuthRepository);

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe('Auth routes', () => {
  describe('POST /auth/register', () => {
    it('registers a user and returns tokens', async () => {
      const app = await createApp();

      const response = await registerUser(app);

      expect(response.statusCode).toBe(201);
      expect(response.json()).toMatchObject({
        user: {
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
      expect(response.json().user).not.toHaveProperty('passwordHash');
      expect(testUsersRepository.items).toHaveLength(1);
      expect(testRefreshTokensRepository.items).toHaveLength(1);
    });

    it('returns 409 when email is already in use', async () => {
      const app = await createApp();
      await registerUser(app);

      const response = await registerUser(app, { name: 'John Doe' });

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({ message: 'User already exists.' });
    });
  });

  describe('POST /auth/login', () => {
    it('authenticates a user', async () => {
      const app = await createApp();
      await registerUser(app);

      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'jane@example.com',
          password: '123456',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        user: { email: 'jane@example.com' },
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('returns 401 for invalid credentials', async () => {
      const app = await createApp();
      await registerUser(app);

      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'jane@example.com',
          password: 'wrong-password',
        },
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({ message: 'Invalid credentials.' });
    });
  });

  describe('POST /auth/refresh', () => {
    it('rotates tokens', async () => {
      const app = await createApp();
      const registered = await registerUser(app);
      const previousRefreshToken = registered.json().refreshToken;

      const response = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        payload: { refreshToken: previousRefreshToken },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().refreshToken).not.toBe(previousRefreshToken);

      const previous = testRefreshTokensRepository.items.find(
        (item) => item.tokenHash === hashRefreshToken(previousRefreshToken),
      );
      expect(previous?.revokedAt).toEqual(expect.any(Date));
    });

    it('returns 401 for an invalid refresh token', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        payload: { refreshToken: 'invalid-token' },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('revokes the refresh token', async () => {
      const app = await createApp();
      const registered = await registerUser(app);
      const refreshToken = registered.json().refreshToken;

      const response = await app.inject({
        method: 'POST',
        url: '/auth/logout',
        payload: { refreshToken },
      });

      expect(response.statusCode).toBe(204);

      const stored = testRefreshTokensRepository.items.find(
        (item) => item.tokenHash === hashRefreshToken(refreshToken),
      );
      expect(stored?.revokedAt).toEqual(expect.any(Date));
    });
  });

  describe('GET /auth/me', () => {
    it('returns the authenticated user', async () => {
      const app = await createApp();
      const registered = await registerUser(app);
      const userId = registered.json().user.id as string;

      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: await authHeader(userId),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        user: {
          id: userId,
          email: 'jane@example.com',
        },
      });
    });

    it('returns 401 without a bearer token', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
