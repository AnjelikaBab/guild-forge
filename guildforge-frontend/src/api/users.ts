import type { Guild } from "../types/Guild";
import type { UserRole } from "../types/User";
import { apiUrl, authHeaders } from "../utils/auth";

export type MyGuildSummary = {
  guildId: number;
  guildName: string;
  theme: string;
  rank: string;
  joinedAt: string;
  logCount: number;
};

export type MyLogEntry = {
  id: number;
  guildId: number;
  guildName: string;
  description: string;
  data?: Record<string, unknown> | null;
  loggedAt: string;
};

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function fetchMyGuilds(): Promise<MyGuildSummary[]> {
  const res = await fetch(apiUrl("/api/users/me/guilds"), { headers: { ...authHeaders() } });
  return parseJson(res);
}

export async function fetchMyLogs(): Promise<MyLogEntry[]> {
  const res = await fetch(apiUrl("/api/users/me/logs"), { headers: { ...authHeaders() } });
  return parseJson(res);
}

export type AdminUserRow = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export async function fetchAdminUsers(): Promise<AdminUserRow[]> {
  const res = await fetch(apiUrl("/api/admin/users"), { headers: { ...authHeaders() } });
  return parseJson(res);
}

export async function fetchAdminGuilds(): Promise<Guild[]> {
  const res = await fetch(apiUrl("/api/admin/guilds"), { headers: { ...authHeaders() } });
  return parseJson(res);
}
