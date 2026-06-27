import type { Rank } from "../types/Rank";
import { apiUrl, authHeaders } from "../utils/auth";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function listRanks(guildId: number): Promise<Rank[]> {
  const res = await fetch(apiUrl(`/api/ranks/guild/${guildId}`));
  return parseJson(res);
}

export async function createRank(
  guildId: number,
  payload: {
    name: string;
    threshold: number;
  },
): Promise<Rank> {
  const res = await fetch(apiUrl(`/api/ranks/guild/${guildId}`), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}
