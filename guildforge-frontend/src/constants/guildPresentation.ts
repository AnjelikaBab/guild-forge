/** Theme slug from backend → tab emoji for the five fixed guilds */
export const GUILD_THEME_EMOJI: Record<string, string> = {
  cooking: "🍳",
  fitness: "💪",
  reading: "📚",
  gaming: "🎮",
  crocheting: "🧶",
};

export function guildTabLabel(theme: string | null, name: string): string {
  const slug = (theme ?? "").toLowerCase();
  const emoji = GUILD_THEME_EMOJI[slug] ?? "⚔️";
  return `${emoji} ${name}`;
}
