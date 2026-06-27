const TOKEN_KEY = "guildforge_jwt";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function apiUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL ?? "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
