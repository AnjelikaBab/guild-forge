import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import * as guildsApi from "../api/guilds";
import * as logsApi from "../api/logs";
import * as ranksApi from "../api/ranks";
import { Sidebar } from "../components/common/Sidebar";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { GuildFeed } from "../components/guild/GuildFeed";
import { GuildHeader } from "../components/guild/GuildHeader";
import { MemberLeaderboard } from "../components/guild/MemberLeaderboard";
import { LogForm } from "../components/log/LogForm";
import { RankBadge } from "../components/rank/RankBadge";
import { RankProgress } from "../components/rank/RankProgress";
import { useAuth } from "../hooks/useAuth";
import { useGuild } from "../hooks/useGuild";
import type { ActivityLog } from "../types/Log";
import type { Rank } from "../types/Rank";

export function GuildPage() {
  const { id } = useParams();
  const guildId = id ? Number(id) : undefined;
  const { guild, loading, error, reload } = useGuild(Number.isFinite(guildId) ? guildId : undefined);
  const { user, refresh } = useAuth();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "overview";

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [leaderboardRows, setLeaderboardRows] = useState<guildsApi.LeaderboardRow[]>([]);
  const [sideError, setSideError] = useState<string | null>(null);

  useEffect(() => {
    if (guildId == null || !Number.isFinite(guildId)) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [l, r, lb] = await Promise.all([
          logsApi.listLogs(guildId),
          ranksApi.listRanks(guildId),
          guildsApi.fetchGuildLeaderboard(guildId),
        ]);
        if (!cancelled) {
          setLogs(l);
          setRanks(r);
          setLeaderboardRows(lb);
        }
      } catch (e) {
        if (!cancelled) {
          setSideError(e instanceof Error ? e.message : "Could not load guild data");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [guildId]);

  const isMember = user && guild && user.guildIds?.includes(guild.id);
  const userLogCount = useMemo(() => {
    if (!user) {
      return 0;
    }
    return logs.filter((l) => l.userId === user.id).length;
  }, [logs, user]);

  const { currentRank, nextRank } = useMemo(() => {
    const ordered = [...ranks].sort((a, b) => a.threshold - b.threshold);
    let current: Rank | null = null;
    for (const r of ordered) {
      if (userLogCount >= r.threshold) {
        current = r;
      }
    }
    const next = ordered.find((r) => r.threshold > userLogCount) ?? null;
    return { currentRank: current, nextRank: next };
  }, [ranks, userLogCount]);

  async function handleJoin() {
    if (guildId == null) {
      return;
    }
    await guildsApi.joinGuild(guildId);
    await refresh();
    await reload();
  }

  async function handleLeave() {
    if (guildId == null) {
      return;
    }
    await guildsApi.leaveGuild(guildId);
    await refresh();
    await reload();
  }

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error || !guild) {
    return (
      <div className="container" style={{ paddingBlock: "2rem" }}>
        <p className="error">{error ?? "Guild not found"}</p>
        <Link to="/guilds">Back to browser</Link>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar guildId={guild.id} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <GuildHeader guild={guild} />
        {sideError && <div className="error">{sideError}</div>}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          {user ? (
            isMember ? (
              <button type="button" className="btn btn-ghost" onClick={handleLeave}>
                Leave guild
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={handleJoin}>
                Join guild
              </button>
            )
          ) : (
            <Link to="/login" className="btn btn-primary">
              Sign in to join
            </Link>
          )}
          <RankBadge rank={currentRank} />
        </div>
        <RankProgress logCount={userLogCount} nextThreshold={nextRank?.threshold ?? null} />
        {tab === "feed" && (
          <>
            {user && isMember && (
              <LogForm
                disabled={false}
                onSubmit={async (desc, data) => {
                  await logsApi.createLog(guild.id, desc, data);
                  const [l, lb] = await Promise.all([
                    logsApi.listLogs(guild.id),
                    guildsApi.fetchGuildLeaderboard(guild.id),
                  ]);
                  setLogs(l);
                  setLeaderboardRows(lb);
                  await refresh();
                }}
              />
            )}
            {user && !isMember && (
              <p style={{ color: "var(--muted)" }}>Join this guild to post activity logs.</p>
            )}
            <GuildFeed logs={logs} />
          </>
        )}
        {tab === "leaderboard" && <MemberLeaderboard rows={leaderboardRows} />}
        {tab === "overview" && (
          <div className="grid-2">
            <div className="panel">
              <div className="eyebrow">Activity</div>
              <GuildFeed logs={logs.slice(0, 3)} />
              <Link to={`/guilds/${guild.id}?tab=feed`} className="btn" style={{ marginTop: "0.75rem", display: "inline-block" }}>
                Open full feed
              </Link>
            </div>
            <div>
              <MemberLeaderboard rows={leaderboardRows.slice(0, 8)} />
              <Link to={`/guilds/${guild.id}?tab=leaderboard`} className="btn" style={{ marginTop: "0.75rem", display: "inline-block" }}>
                Full leaderboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
