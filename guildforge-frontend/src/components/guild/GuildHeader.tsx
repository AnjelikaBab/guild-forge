import type { Guild } from "../../types/Guild";

type Props = { guild: Guild };

export function GuildHeader({ guild }: Props) {
  const stripe = guild.theme ?? "linear-gradient(90deg, #c9a227, #5b4a12)";
  return (
    <section className="panel" style={{ overflow: "hidden", padding: 0 }}>
      <div style={{ height: 6, background: stripe }} />
      <div style={{ padding: "1.25rem" }}>
        <div className="eyebrow">Guild hall</div>
        <h1 className="display page-title" style={{ marginTop: 8 }}>
          {guild.name}
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", maxWidth: 720 }}>
          {guild.description ?? "This guild has not set a description."}
        </p>
      </div>
    </section>
  );
}
