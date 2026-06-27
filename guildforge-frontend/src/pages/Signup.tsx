import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signup(username, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, paddingBlock: "2rem" }}>
      <h1 className="display">Join the forge</h1>
      <p style={{ color: "var(--muted)" }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
      <form className="panel" style={{ marginTop: "1rem" }} onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="su-user">Username</label>
          <input id="su-user" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="su-email">Email</label>
          <input id="su-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="su-pass">Password</label>
          <input
            id="su-pass"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn btn-primary">
          Create account
        </button>
      </form>
    </div>
  );
}
