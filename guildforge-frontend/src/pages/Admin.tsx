import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as guildsApi from "../api/guilds";
import * as ranksApi from "../api/ranks";
import { fetchAdminGuilds, fetchAdminUsers, type AdminUserRow } from "../api/users";
import type { Guild } from "../types/Guild";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export function Admin() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [guildName, setGuildName] = useState("");
  const [guildDesc, setGuildDesc] = useState("");
  const [guildTheme, setGuildTheme] = useState("");
  const [guildDsl, setGuildDsl] = useState("");
  const [rankGuildId, setRankGuildId] = useState("");
  const [rankName, setRankName] = useState("");
  const [rankThreshold, setRankThreshold] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      return;
    }
    let c = false;
    (async () => {
      try {
        const [u, g] = await Promise.all([fetchAdminUsers(), fetchAdminGuilds()]);
        if (!c) {
          setUsers(u);
          setGuilds(g);
        }
      } catch (e) {
        if (!c) {
          setLoadError(e instanceof Error ? e.message : "Forbidden or failed to load");
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
        <p>Sign in to access admin tools.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
  if (user.role !== "ADMIN") {
    return (
      <div className="container" style={{ paddingBlock: "2rem" }}>
        <h1 className="display page-title">Admin</h1>
        <p style={{ color: "var(--muted)" }}>Only platform admins can view this panel.</p>
      </div>
    );
  }

  async function onCreateGuild(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await guildsApi.createGuild({
        name: guildName,
        theme: guildTheme,
        description: guildDesc || null,
        dslRules: guildDsl || null,
      });
      setMessage("Guild created");
      setGuildName("");
      setGuildDesc("");
      setGuildTheme("");
      setGuildDsl("");
      setGuilds(await fetchAdminGuilds());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  async function onCreateRank(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const gid = Number(rankGuildId);
    if (!Number.isFinite(gid)) {
      setError("Guild id must be a number");
      return;
    }
    try {
      await ranksApi.createRank(gid, { name: rankName, threshold: rankThreshold });
      setMessage("Rank created");
      setRankName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="container" style={{ paddingBlock: "2rem", maxWidth: 1100 }}>
      <h1 className="display page-title">Admin</h1>
      <p style={{ color: "var(--muted)" }}>Bird&apos;s-eye view of users and guilds. Promote a user to ADMIN in the database when needed.</p>
      {loadError && <p className="error">{loadError}</p>}
      {message && <p style={{ color: "var(--muted)" }}>{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="panel" style={{ marginTop: "1rem", overflowX: "auto" }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          All users
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--muted)" }}>
              <th style={{ padding: "0.5rem" }}>Id</th>
              <th style={{ padding: "0.5rem" }}>Username</th>
              <th style={{ padding: "0.5rem" }}>Email</th>
              <th style={{ padding: "0.5rem" }}>Role</th>
              <th style={{ padding: "0.5rem" }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "0.5rem" }}>{u.id}</td>
                <td style={{ padding: "0.5rem" }}>{u.username}</td>
                <td style={{ padding: "0.5rem" }}>{u.email}</td>
                <td style={{ padding: "0.5rem" }}>{u.role}</td>
                <td style={{ padding: "0.5rem", color: "var(--muted)" }}>{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel" style={{ marginTop: "1rem", overflowX: "auto" }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          All guilds
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--muted)" }}>
              <th style={{ padding: "0.5rem" }}>Id</th>
              <th style={{ padding: "0.5rem" }}>Name</th>
              <th style={{ padding: "0.5rem" }}>Theme</th>
              <th style={{ padding: "0.5rem" }}>Members</th>
            </tr>
          </thead>
          <tbody>
            {guilds.map((g) => (
              <tr key={g.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "0.5rem" }}>{g.id}</td>
                <td style={{ padding: "0.5rem" }}>{g.name}</td>
                <td style={{ padding: "0.5rem" }}>{g.theme}</td>
                <td style={{ padding: "0.5rem" }}>{g.memberCount ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid-2" style={{ marginTop: "1.5rem" }}>
        <form className="panel" onSubmit={onCreateGuild}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Extra guild (optional)
          </div>
          <div className="field">
            <label>Name</label>
            <input value={guildName} onChange={(e) => setGuildName(e.target.value)} required />
          </div>
          <div className="field">
            <label>Theme (required)</label>
            <input value={guildTheme} onChange={(e) => setGuildTheme(e.target.value)} required />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={guildDesc} onChange={(e) => setGuildDesc(e.target.value)} rows={3} />
          </div>
          <div className="field">
            <label>DSL rules</label>
            <textarea value={guildDsl} onChange={(e) => setGuildDsl(e.target.value)} rows={4} />
          </div>
          <button type="submit" className="btn btn-primary">
            Create guild
          </button>
        </form>
        <form className="panel" onSubmit={onCreateRank}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Add rank tier
          </div>
          <div className="field">
            <label>Guild id</label>
            <input value={rankGuildId} onChange={(e) => setRankGuildId(e.target.value)} required />
          </div>
          <div className="field">
            <label>Rank name</label>
            <input value={rankName} onChange={(e) => setRankName(e.target.value)} required />
          </div>
          <div className="field">
            <label>Threshold (logs)</label>
            <input type="number" min={0} value={rankThreshold} onChange={(e) => setRankThreshold(Number(e.target.value))} />
          </div>
          <button type="submit" className="btn btn-primary">
            Create rank
          </button>
        </form>
      </div>
    </div>
  );
}
