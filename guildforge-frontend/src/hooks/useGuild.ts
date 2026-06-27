import { useCallback, useEffect, useState } from "react";
import * as guildsApi from "../api/guilds";
import type { Guild } from "../types/Guild";

export function useGuild(guildId: number | undefined) {
  const [guild, setGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (guildId == null) {
      setGuild(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const g = await guildsApi.getGuild(guildId);
      setGuild(g);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load guild");
      setGuild(null);
    } finally {
      setLoading(false);
    }
  }, [guildId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { guild, loading, error, reload: load };
}
