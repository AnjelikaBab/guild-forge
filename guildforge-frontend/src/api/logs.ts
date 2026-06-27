import type { ActivityLog } from "../types/Log";
import { apiUrl, authHeaders } from "../utils/auth";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function listLogs(guildId: number): Promise<ActivityLog[]> {
  const res = await fetch(apiUrl(`/api/logs/guild/${guildId}`));
  return parseJson(res);
}

export async function createLog(
  guildId: number,
  description: string,
  data?: Record<string, unknown> | null,
): Promise<ActivityLog> {
  const res = await fetch(apiUrl(`/api/logs/guild/${guildId}`), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ description, data: data ?? null }),
  });
  return parseJson(res);
}
