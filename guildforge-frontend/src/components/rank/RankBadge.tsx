import type { Rank } from "../../types/Rank";

type Props = {
  rank: Rank | null;
};

export function RankBadge({ rank }: Props) {
  if (!rank) {
    return (
      <span
        className="panel"
        style={{ display: "inline-block", padding: "0.35rem 0.65rem", fontSize: "0.85rem" }}
      >
        Unranked
      </span>
    );
  }
  return (
    <span
      className="panel"
      style={{
        display: "inline-block",
        padding: "0.35rem 0.65rem",
        fontSize: "0.85rem",
        borderColor: "rgba(201, 162, 39, 0.45)",
        background: "var(--accent-soft)",
      }}
    >
      {rank.name}
    </span>
  );
}
