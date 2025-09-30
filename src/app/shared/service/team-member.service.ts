// team-member.service.ts
import { Injectable, signal } from '@angular/core';
import { TeamMember } from '../model/team-member.model';

@Injectable({
  providedIn: 'root',
})
export class TeamMemberService {
  private readonly STORAGE_KEY = 'teamMembers';

  members = signal<TeamMember[]>(this.loadFromStorage());

  constructor() {
    this.saveToStorage(this.members());
  }

  addMember(member: { name: string; email: string; role: string }) {
    const current = this.members();
    const nextId = current.length ? Math.max(...current.map((m) => Number(m.id))) + 1 : 1;

    const avatar = this.generateInitials(member.name);

    const newMember: TeamMember = {
      id: String(nextId),
      name: member.name,
      email: member.email,
      role: member.role,
      avatar,
      teams: ['Design', 'Product', 'Marketing'],
      extraTeams: 4,
      status: 'Active',
    };

    const updated = [...current, newMember];
    this.members.set(updated);
    this.saveToStorage(updated);
  }

  updateMember(id: string, updatedMember: Partial<TeamMember>) {
    this.members.update((list) => {
      const updated = list.map((m) => (m.id === id ? { ...m, ...updatedMember } : m));
      this.saveToStorage(updated);
      return updated;
    });
  }

  deleteMember(id: string) {
    this.members.update((list) => {
      const updated = list.filter((m) => m.id !== id);
      this.saveToStorage(updated);
      return updated;
    });
  }

  getMemberById(id: string): TeamMember | undefined {
    return this.members().find((m) => m.id === id);
  }

  private saveToStorage(data: TeamMember[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private loadFromStorage(): TeamMember[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : TEAM_MEMBERS_DATA;
  }

  private generateInitials(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  }
}

// seed data (can be in a separate file if you prefer)
const TEAM_MEMBERS_DATA: TeamMember[] = [
  {
    id: '1',
    name: 'Farouk Muhammed',
    avatar: 'FM',
    status: 'Active',
    role: 'Product Designer',
    email: 'olivia@untitledui.com',
    teams: ['Design', 'Product', 'Marketing'],
    extraTeams: 4,
  },
  {
    id: '2',
    name: 'Saliu Hammed',
    avatar: 'SH',
    status: 'Active',
    role: 'Product Designer',
    email: 'olivia@untitledui.com',
    teams: ['Design', 'Product', 'Marketing'],
    extraTeams: 4,
  },
  {
    id: '3',
    name: 'Farouk Muhammed',
    avatar: 'FM',
    status: 'Active',
    role: 'Product Designer',
    email: 'olivia@untitledui.com',
    teams: ['Design', 'Product', 'Marketing'],
    extraTeams: 4,
  },
  {
    id: '4',
    name: 'Ahmed Ibrahim',
    avatar: 'AI',
    status: 'Active',
    role: 'Frontend Developer',
    email: 'ahmed@untitledui.com',
    teams: ['Design', 'Product', 'Marketing'],
    extraTeams: 4,
  },
  {
    id: '5',
    name: 'Aisha Johnson',
    avatar: 'AJ',
    status: 'Active',
    role: 'UX Designer',
    email: 'aisha@untitledui.com',
    teams: ['Design', 'Product', 'Marketing'],
    extraTeams: 4,
  },
  {
    id: '6',
    name: 'Chidi Okonkwo',
    avatar: 'CO',
    status: 'Active',
    role: 'Backend Developer',
    email: 'chidi@untitledui.com',
    teams: ['Design', 'Product', 'Marketing'],
    extraTeams: 4,
  },
  {
    id: '7',
    name: 'Ngozi Adeyemi',
    avatar: 'NA',
    status: 'Active',
    role: 'Product Manager',
    email: 'ngozi@untitledui.com',
    teams: ['Design', 'Product', 'Marketing'],
    extraTeams: 4,
  },
  {
    id: '8',
    name: 'Tunde Williams',
    avatar: 'TW',
    status: 'Active',
    role: 'Data Analyst',
    email: 'tunde@untitledui.com',
    teams: ['Design', 'Product', 'Marketing'],
    extraTeams: 4,
  },
  {
    id: '9',
    name: 'Zainab Hassan',
    avatar: 'ZH',
    status: 'Active',
    role: 'Marketing Manager',
    email: 'zainab@untitledui.com',
    teams: ['Design', 'Product', 'Marketing'],
    extraTeams: 4,
  },
  {
    id: '10',
    name: 'Emeka Nwosu',
    avatar: 'EN',
    status: 'Active',
    role: 'DevOps Engineer',
    email: 'emeka@untitledui.com',
    teams: ['Design', 'Product', 'Marketing'],
    extraTeams: 4,
  },
];
