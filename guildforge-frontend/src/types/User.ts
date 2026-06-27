export type UserRole = "ADMIN" | "GUILD_MASTER" | "MEMBER";

export type AuthUser = {
  id: number;
  username: string;
  email?: string;
  role?: UserRole;
  guildIds?: number[];
};
