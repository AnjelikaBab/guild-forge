import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password.");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, paddingBlock: "2rem" }}>
      <h1 className="display">Welcome back</h1>
      <p style={{ color: "var(--muted)" }}>
        New here? <Link to="/signup">Create an account</Link>
      </p>
      <form className="panel" style={{ marginTop: "1rem" }} onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn btn-primary">
          Sign in
        </button>
      </form>
    </div>
  );
}
