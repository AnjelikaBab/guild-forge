import type { Guild } from "../types/Guild";
import { apiUrl, authHeaders } from "../utils/auth";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function listGuilds(): Promise<Guild[]> {
  const res = await fetch(apiUrl("/api/guilds"));
  return parseJson(res);
}

export async function getGuild(id: number): Promise<Guild> {
  const res = await fetch(apiUrl(`/api/guilds/${id}`));
  return parseJson(res);
}

export async function createGuild(payload: {
  name: string;
  theme: string;
  description?: string | null;
  dslRules?: string | null;
}): Promise<Guild> {
  const res = await fetch(apiUrl("/api/guilds"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function joinGuild(guildId: number): Promise<void> {
  const res = await fetch(apiUrl(`/api/memberships/guild/${guildId}/join`), {
    method: "POST",
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export async function leaveGuild(guildId: number): Promise<void> {
  const res = await fetch(apiUrl(`/api/memberships/guild/${guildId}/leave`), {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export type LeaderboardRow = {
  userId: number;
  username: string;
  rank: string;
  logCount: number;
  joinedAt: string;
};

export async function fetchGuildLeaderboard(guildId: number): Promise<LeaderboardRow[]> {
  const res = await fetch(apiUrl(`/api/guilds/${guildId}/leaderboard`));
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<LeaderboardRow[]>;
}
