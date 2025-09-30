// team-member.model.ts
export type TeamMember = {
  id: string;
  name: string;
  avatar: string;
  status: 'Active' | 'Inactive';
  role: string;
  email: string;
  teams: string[];
  extraTeams: number;
};
