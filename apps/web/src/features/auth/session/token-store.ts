const REFRESH_TOKEN_KEY = 'kikos.crm.refreshToken';

let accessToken: string | null = null;

export const tokenStore = {
  getAccessToken() {
    return accessToken;
  },

  setAccessToken(token: string | null) {
    accessToken = token;
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string | null) {
    if (!token) {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return;
    }

    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  setSession(tokens: { accessToken: string; refreshToken: string }) {
    accessToken = tokens.accessToken;
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },

  clear() {
    accessToken = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
