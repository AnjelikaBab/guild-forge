import type { Rank } from "../../types/Rank";

type Props = {
  ranks: Rank[];
};

export function GuildLeaderboard({ ranks }: Props) {
  return (
    <div className="panel" style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--muted)" }}>
            <th style={{ padding: "0.5rem" }}>Rank</th>
            <th style={{ padding: "0.5rem" }}>Logs to reach</th>
          </tr>
        </thead>
        <tbody>
          {ranks.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid var(--border)" }}>
              <td style={{ padding: "0.65rem 0.5rem", fontWeight: 600 }}>{r.name}</td>
              <td style={{ padding: "0.65rem 0.5rem" }}>{r.threshold}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {ranks.length === 0 && (
        <p style={{ color: "var(--muted)", marginTop: "0.75rem" }}>No ranks configured for this guild.</p>
      )}
    </div>
  );
}
