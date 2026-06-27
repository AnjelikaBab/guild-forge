import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div className="container" style={{ paddingBlock: "3rem" }}>
      <p className="eyebrow">GuildForge</p>
      <h1 className="display page-title" style={{ fontSize: "2.75rem", maxWidth: 720 }}>
        Themed guilds. Real activity. Ranks that move when you do.
      </h1>
      <p style={{ color: "var(--muted)", maxWidth: 620, lineHeight: 1.65 }}>
        GuildForge is a community platform: you join guilds with their own culture and rules, log what you did (meals,
        workouts, books, games, yarn projects), and earn ranks as you stay active. Five guilds ship with the product
        — Cooking, Fitness, Reading, Gaming, and Crocheting — each with its own look and leaderboard.
      </p>
      <p style={{ color: "var(--muted)", maxWidth: 620, lineHeight: 1.65 }}>
        Guild Masters tune ranking through a small rules language. Members see tabs for every guild they join: log a
        win, watch the feed, climb the board, and watch the progress bar edge toward the next rank after each post.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
        <Link to="/signup" className="btn btn-primary">
          Create account
        </Link>
        <Link to="/login" className="btn">
          Sign in
        </Link>
        <Link to="/guilds" className="btn btn-ghost">
          Browse the five guilds
        </Link>
      </div>
    </div>
  );
}
