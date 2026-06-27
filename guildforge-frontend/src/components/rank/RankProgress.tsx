type Props = {
  /** Number of activity logs the member has posted in this guild (placeholder until per-user counts exist). */
  logCount: number;
  nextThreshold: number | null;
};

export function RankProgress({ logCount, nextThreshold }: Props) {
  if (nextThreshold == null || nextThreshold <= 0) {
    return (
      <div className="panel" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
        Highest configured rank reached — or add another rank with a higher threshold.
      </div>
    );
  }
  const pct = Math.min(100, Math.round((logCount / nextThreshold) * 100));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--muted)" }}>
        <span>Progress toward next rank (by log count)</span>
        <span>
          {logCount} / {nextThreshold} logs
        </span>
      </div>
      <div
        style={{
          marginTop: 8,
          height: 10,
          borderRadius: 999,
          background: "var(--border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg, #c9a227, #f0d060)",
            transition: "width 0.25s ease",
          }}
        />
      </div>
    </div>
  );
}
