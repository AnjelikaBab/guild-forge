import { useEffect, useState } from "react";
import * as guildsApi from "../api/guilds";
import type { Guild } from "../types/Guild";
import { GuildCard } from "../components/guild/GuildCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export function GuildBrowser() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await guildsApi.listGuilds();
        if (!cancelled) {
          setGuilds(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load guilds");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return (
      <div className="container" style={{ paddingBlock: "2rem" }}>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBlock: "2rem" }}>
      <h1 className="display page-title">Guild browser</h1>
      <p style={{ color: "var(--muted)", maxWidth: 640, lineHeight: 1.6 }}>
        GuildForge ships with five themed halls — Cooking, Fitness, Reading, Gaming, and Crocheting. Open a card to join,
        log activity, and climb ranks that react when you post.
      </p>
      <div className="grid-2" style={{ marginTop: "1.25rem" }}>
        {guilds.map((g) => (
          <GuildCard key={g.id} guild={g} />
        ))}
      </div>
      {guilds.length === 0 && (
        <p style={{ color: "var(--muted)", marginTop: "1rem" }}>
          No guilds returned. Run the API with migrations through V7 so the five fixed guilds are seeded.
        </p>
      )}
    </div>
  );
}
