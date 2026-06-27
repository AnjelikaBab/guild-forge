export type Guild = {
  id: number;
  name: string;
  description: string | null;
  theme: string | null;
  ownerId?: number | null;
  dslRules?: string | null;
  memberCount?: number;
  createdAt?: string;
};
