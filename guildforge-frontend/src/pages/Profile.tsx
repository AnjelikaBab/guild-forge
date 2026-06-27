import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyGuilds, fetchMyLogs, type MyGuildSummary, type MyLogEntry } from "../api/users";
import { guildTabLabel } from "../constants/guildPresentation";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

export function Profile() {
  const { user, loading } = useAuth();
  const [guilds, setGuilds] = useState<MyGuildSummary[]>([]);
  const [logs, setLogs] = useState<MyLogEntry[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    let c = false;
    (async () => {
      try {
        const [g, l] = await Promise.all([fetchMyGuilds(), fetchMyLogs()]);
        if (!c) {
          setGuilds(g);
          setLogs(l);
        }
      } catch (e) {
        if (!c) {
          setErr(e instanceof Error ? e.message : "Failed to load profile data");
        }
      }
    })();
    return () => {
      c = true;
    };
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!user) {
    return (
      <div className="container" style={{ paddingBlock: "2rem" }}>
        <p>Please sign in to view your profile.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBlock: "2rem", maxWidth: 720 }}>
      <h1 className="display page-title">Profile</h1>
      {err && <p className="error">{err}</p>}
      <div className="panel">
        <p>
          <span className="eyebrow">Username</span>
          <br />
          <strong>{user.username}</strong>
        </p>
        {user.email && (
          <p>
            <span className="eyebrow">Email</span>
            <br />
            {user.email}
          </p>
        )}
        {user.role && (
          <p>
            <span className="eyebrow">Role</span>
            <br />
            <strong>{user.role}</strong>
          </p>
        )}
      </div>

      <h2 className="display" style={{ fontSize: "1.35rem", marginTop: "2rem" }}>
        Your guilds
      </h2>
      <div className="grid-2" style={{ marginTop: "0.75rem" }}>
        {guilds.map((g) => (
          <div key={g.guildId} className="panel">
            <div style={{ fontWeight: 700 }}>{guildTabLabel(g.theme, g.guildName)}</div>
            <p style={{ margin: "0.5rem 0", color: "var(--muted)", fontSize: "0.9rem" }}>
              Rank: <strong style={{ color: "var(--text)" }}>{g.rank}</strong>
              <br />
              Logs in this guild: {g.logCount}
              <br />
              Joined: {new Date(g.joinedAt).toLocaleDateString()}
            </p>
            <Link to={`/guilds/${g.guildId}`} className="btn btn-ghost" style={{ fontSize: "0.85rem" }}>
              Open guild
            </Link>
          </div>
        ))}
      </div>
      {guilds.length === 0 && <p style={{ color: "var(--muted)" }}>Not in any guilds yet.</p>}

      <h2 className="display" style={{ fontSize: "1.35rem", marginTop: "2rem" }}>
        Activity history
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: "0.75rem 0 0" }}>
        {logs.map((log) => (
          <li key={log.id} className="panel" style={{ marginBottom: "0.65rem" }}>
            <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
              {log.guildName} · {new Date(log.loggedAt).toLocaleString()}
            </span>
            <p style={{ margin: "0.35rem 0 0" }}>{log.description}</p>
          </li>
        ))}
      </ul>
      {logs.length === 0 && <p style={{ color: "var(--muted)" }}>No logs yet.</p>}
    </div>
  );
}
