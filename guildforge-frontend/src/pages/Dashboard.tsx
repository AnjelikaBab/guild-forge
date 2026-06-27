import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as guildsApi from "../api/guilds";
import * as logsApi from "../api/logs";
import * as ranksApi from "../api/ranks";
import { fetchMyGuilds, type MyGuildSummary } from "../api/users";
import { guildTabLabel } from "../constants/guildPresentation";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { GuildFeed } from "../components/guild/GuildFeed";
import { MemberLeaderboard } from "../components/guild/MemberLeaderboard";
import { LogForm } from "../components/log/LogForm";
import { RankProgress } from "../components/rank/RankProgress";
import { useAuth } from "../hooks/useAuth";
import type { ActivityLog } from "../types/Log";
import type { Rank } from "../types/Rank";

export function Dashboard() {
  const { user, loading: authLoading, refresh: refreshAuth } = useAuth();
  const [myGuilds, setMyGuilds] = useState<MyGuildSummary[]>([]);
  const [loadGuilds, setLoadGuilds] = useState(true);
  const [activeGuildId, setActiveGuildId] = useState<number | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [leaderboard, setLeaderboard] = useState<guildsApi.LeaderboardRow[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [tabError, setTabError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadGuilds(true);
      try {
        const list = await fetchMyGuilds();
        if (cancelled) {
          return;
        }
        setMyGuilds(list);
        setActiveGuildId((prev) => {
          if (prev != null && list.some((g) => g.guildId === prev)) {
            return prev;
          }
          return list[0]?.guildId ?? null;
        });
      } catch {
        if (!cancelled) {
          setTabError("Could not load your guilds");
        }
      } finally {
        if (!cancelled) {
          setLoadGuilds(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  useEffect(() => {
    if (activeGuildId == null) {
      setLogs([]);
      setLeaderboard([]);
      setRanks([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setTabError(null);
      try {
        const [l, lb, r] = await Promise.all([
          logsApi.listLogs(activeGuildId),
          guildsApi.fetchGuildLeaderboard(activeGuildId),
          ranksApi.listRanks(activeGuildId),
        ]);
        if (!cancelled) {
          setLogs(l);
          setLeaderboard(lb);
          setRanks(r);
        }
      } catch (e) {
        if (!cancelled) {
          setTabError(e instanceof Error ? e.message : "Failed to load guild tab");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeGuildId]);

  const activeSummary = useMemo(
    () => myGuilds.find((g) => g.guildId === activeGuildId) ?? null,
    [myGuilds, activeGuildId],
  );

  const userLogCount = useMemo(() => {
    if (!user || activeGuildId == null) {
      return 0;
    }
    return logs.filter((l) => l.userId === user.id).length;
  }, [logs, user, activeGuildId]);

  const { nextRankThreshold } = useMemo(() => {
    const ordered = [...ranks].sort((a, b) => a.threshold - b.threshold);
    const next = ordered.find((r) => r.threshold > userLogCount);
    return { nextRankThreshold: next?.threshold ?? null };
  }, [ranks, userLogCount]);

  if (authLoading) {
    return <LoadingSpinner />;
  }
  if (!user) {
    return (
      <div className="container" style={{ paddingBlock: "2rem" }}>
        <p>Sign in to open your dashboard.</p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
          Login
        </Link>
      </div>
    );
  }

  if (loadGuilds) {
    return <LoadingSpinner label="Loading your guilds…" />;
  }

  return (
    <div className="container" style={{ paddingBlock: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "1rem",
        }}
      >
        {myGuilds.length === 0 ? (
          <p style={{ margin: 0, color: "var(--muted)" }}>You have not joined a guild yet.</p>
        ) : (
          myGuilds.map((g) => (
            <button
              key={g.guildId}
              type="button"
              className={g.guildId === activeGuildId ? "btn btn-primary" : "btn btn-ghost"}
              onClick={() => setActiveGuildId(g.guildId)}
            >
              {guildTabLabel(g.theme, g.guildName)}
            </button>
          ))
        )}
        <Link to="/guilds" className="btn" style={{ marginLeft: "auto" }}>
          Browse guilds
        </Link>
      </div>

      {tabError && <p className="error">{tabError}</p>}

      {activeGuildId != null && activeSummary && (
        <div style={{ display: "grid", gap: "1rem" }}>
          <div>
            <p className="eyebrow">Your rank</p>
            <p className="display" style={{ fontSize: "1.35rem", margin: "0.25rem 0" }}>
              {activeSummary.rank}
            </p>
            <RankProgress logCount={userLogCount} nextThreshold={nextRankThreshold} />
          </div>

          <LogForm
            onSubmit={async (description, data) => {
              await logsApi.createLog(activeGuildId, description, data);
              const [l, lb, list] = await Promise.all([
                logsApi.listLogs(activeGuildId),
                guildsApi.fetchGuildLeaderboard(activeGuildId),
                fetchMyGuilds(),
              ]);
              setLogs(l);
              setLeaderboard(lb);
              setMyGuilds(list);
              await refreshAuth();
            }}
          />

          <div className="grid-2" style={{ alignItems: "start" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Recent activity
              </div>
              <GuildFeed logs={logs} />
            </div>
            <MemberLeaderboard rows={leaderboard} />
          </div>
        </div>
      )}

      {activeGuildId == null && (
        <div className="panel">
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Join one of the five themed guilds — Cooking, Fitness, Reading, Gaming, or Crocheting — then log activities
            and climb the ranks.
          </p>
          <Link to="/guilds" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
            Browse guilds
          </Link>
        </div>
      )}
    </div>
  );
}
