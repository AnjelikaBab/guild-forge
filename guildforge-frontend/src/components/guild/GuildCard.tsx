import { Link } from "react-router-dom";
import type { Guild } from "../../types/Guild";

type Props = { guild: Guild };

export function GuildCard({ guild }: Props) {
  return (
    <Link
      to={`/guilds/${guild.id}`}
      className="panel"
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        transition: "transform 0.12s ease, border-color 0.12s ease",
      }}
    >
      <div className="eyebrow">{guild.theme ?? "Guild"}</div>
      <h3 className="display" style={{ margin: "0.35rem 0" }}>
        {guild.name}
      </h3>
      <p style={{ margin: 0, color: "var(--muted)", minHeight: 44 }}>
        {guild.description ?? "No description yet."}
      </p>
      {guild.memberCount != null && (
        <div style={{ marginTop: "0.85rem", fontSize: "0.85rem", color: "var(--muted)" }}>
          {guild.memberCount} members
        </div>
      )}
    </Link>
  );
}
