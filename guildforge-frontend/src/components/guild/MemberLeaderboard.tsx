import type { LeaderboardRow } from "../../api/guilds";

type Props = { rows: LeaderboardRow[] };

export function MemberLeaderboard({ rows }: Props) {
  return (
    <div className="panel" style={{ overflowX: "auto" }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        Leaderboard
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--muted)" }}>
            <th style={{ padding: "0.5rem" }}>#</th>
            <th style={{ padding: "0.5rem" }}>Member</th>
            <th style={{ padding: "0.5rem" }}>Rank</th>
            <th style={{ padding: "0.5rem" }}>Logs</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.userId} style={{ borderTop: "1px solid var(--border)" }}>
              <td style={{ padding: "0.65rem 0.5rem", color: "var(--muted)" }}>{i + 1}</td>
              <td style={{ padding: "0.65rem 0.5rem", fontWeight: 600 }}>{r.username}</td>
              <td style={{ padding: "0.65rem 0.5rem" }}>★ {r.rank}</td>
              <td style={{ padding: "0.65rem 0.5rem" }}>{r.logCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p style={{ color: "var(--muted)", marginTop: "0.75rem" }}>No members yet. Join and log activity.</p>
      )}
    </div>
  );
}
