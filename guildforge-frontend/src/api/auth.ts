import type { AuthUser } from "../types/User";
import { apiUrl, authHeaders, getToken, setToken } from "../utils/auth";

export type LoginBody = { username: string; password: string };
export type SignupBody = LoginBody & { email: string };

type AuthResponse = { token: string; user: AuthUser };

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function login(body: LoginBody): Promise<AuthResponse> {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await parseJson<AuthResponse>(res);
  setToken(data.token);
  return data;
}

export async function signup(body: SignupBody): Promise<AuthResponse> {
  const res = await fetch(apiUrl("/api/auth/signup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await parseJson<AuthResponse>(res);
  setToken(data.token);
  return data;
}

export async function fetchMe(): Promise<AuthUser & { createdAt?: string }> {
  const res = await fetch(apiUrl("/api/users/me"), { headers: { ...authHeaders() } });
  return parseJson(res);
}

export function logout(): void {
  setToken(null);
}

export function hasStoredSession(): boolean {
  return Boolean(getToken());
}
