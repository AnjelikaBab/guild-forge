export type ActivityLog = {
  id: number;
  guildId: number;
  userId: number;
  username: string;
  description: string;
  data?: Record<string, unknown> | null;
  loggedAt: string;
};
