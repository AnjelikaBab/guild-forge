import { NavLink } from "react-router-dom";

const tab = ({ isActive }: { isActive: boolean }) => ({
  display: "block",
  padding: "0.55rem 0.75rem",
  borderRadius: 8,
  color: isActive ? "var(--text)" : "var(--muted)",
  background: isActive ? "var(--accent-soft)" : "transparent",
  border: `1px solid ${isActive ? "rgba(201, 162, 39, 0.35)" : "transparent"}`,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: "0.9rem",
});

type Props = {
  guildId: number;
};

export function Sidebar({ guildId }: Props) {
  const base = `/guilds/${guildId}`;
  return (
    <aside className="panel" style={{ padding: "0.75rem" }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        Guild
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <NavLink to={base} end style={tab}>
          Overview
        </NavLink>
        <NavLink to={`${base}?tab=feed`} style={tab}>
          Feed
        </NavLink>
        <NavLink to={`${base}?tab=leaderboard`} style={tab}>
          Leaderboard
        </NavLink>
      </nav>
    </aside>
  );
}
