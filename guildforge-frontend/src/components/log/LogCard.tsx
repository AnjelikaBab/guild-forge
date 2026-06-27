import type { ActivityLog } from "../../types/Log";

type Props = { log: ActivityLog };

export function LogCard({ log }: Props) {
  const when = new Date(log.loggedAt).toLocaleString();
  return (
    <article className="panel" style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <strong>{log.username}</strong>
        <time dateTime={log.loggedAt} style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
          {when}
        </time>
      </div>
      <p style={{ margin: "0.5rem 0 0", whiteSpace: "pre-wrap" }}>{log.description}</p>
      {log.data != null && Object.keys(log.data).length > 0 && (
        <pre
          style={{
            margin: "0.75rem 0 0",
            padding: "0.65rem",
            borderRadius: 8,
            background: "#0c1118",
            border: "1px solid var(--border)",
            fontSize: "0.8rem",
            overflow: "auto",
          }}
        >
          {JSON.stringify(log.data, null, 2)}
        </pre>
      )}
    </article>
  );
}
