import { ApiError, UnauthorizedError } from '@/shared/http/errors';
import type { RequestOptions } from '@/shared/http/types';
import { tokenStore } from '@/features/auth/session/token-store';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

let refreshPromise: Promise<boolean> | null = null;

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

function extractMessage(body: unknown, fallback: string) {
  if (
    body &&
    typeof body === 'object' &&
    'message' in body &&
    typeof body.message === 'string'
  ) {
    return body.message;
  }

  return fallback;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenStore.getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    tokenStore.clear();
    return false;
  }

  const data = (await response.json()) as RefreshResponse;
  tokenStore.setSession(data);
  return true;
}

async function ensureRefreshed(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function requestOnce<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers = {}, auth = true, signal } = options;

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const accessToken = tokenStore.getAccessToken();
    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  const payload = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(
      extractMessage(payload, response.statusText || 'Request failed'),
      response.status,
      payload,
    );
  }

  return payload as T;
}

export const httpClient = {
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    try {
      return await requestOnce<T>(path, options);
    } catch (error) {
      const shouldRetry =
        error instanceof ApiError &&
        error.status === 401 &&
        options.auth !== false &&
        !path.startsWith('/auth/login') &&
        !path.startsWith('/auth/refresh') &&
        !path.startsWith('/auth/register');

      if (!shouldRetry) {
        throw error;
      }

      const refreshed = await ensureRefreshed();

      if (!refreshed) {
        throw new UnauthorizedError(
          error instanceof ApiError ? error.message : undefined,
        );
      }

      return requestOnce<T>(path, options);
    }
  },

  get<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(path, { ...options, method: 'GET' });
  },

  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) {
    return this.request<T>(path, { ...options, method: 'POST', body });
  },

  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) {
    return this.request<T>(path, { ...options, method: 'PATCH', body });
  },

  delete<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  },
};
