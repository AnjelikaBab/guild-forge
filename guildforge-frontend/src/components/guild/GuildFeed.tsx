import type { ActivityLog } from "../../types/Log";
import { LogCard } from "../log/LogCard";

type Props = {
  logs: ActivityLog[];
};

export function GuildFeed({ logs }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {logs.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No activity yet. Be the first to log progress.</p>
      ) : (
        logs.map((log) => <LogCard key={log.id} log={log} />)
      )}
    </div>
  );
}
