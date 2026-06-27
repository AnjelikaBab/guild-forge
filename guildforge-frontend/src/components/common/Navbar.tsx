import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? "var(--text)" : "var(--muted)",
  fontWeight: isActive ? 700 : 500,
});

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(12, 15, 20, 0.85)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          paddingBlock: "0.85rem",
        }}
      >
        <Link to="/" className="display" style={{ color: "var(--text)", fontWeight: 600 }}>
          GuildForge
        </Link>
        <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <NavLink to="/guilds" style={linkStyle}>
            Guilds
          </NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" style={linkStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" style={linkStyle}>
                Profile
              </NavLink>
              {user.role === "ADMIN" && (
                <NavLink to="/admin" style={linkStyle}>
                  Admin
                </NavLink>
              )}
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={linkStyle}>
                Login
              </NavLink>
              <NavLink to="/signup" className="btn btn-primary" style={{ textDecoration: "none" }}>
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
