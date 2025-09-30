import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
} from '@tanstack/angular-table';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FlexRenderDirective,
    FormsModule,
    HlmButtonImports,
    HlmIconImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmTableImports,
  ],
  templateUrl: './data-table.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  private cdr = inject(ChangeDetectorRef);

  private readonly STORAGE_KEY = 'teamMembers';

  // BehaviorSubject to hold data
  private readonly _dataSubject = new BehaviorSubject<TeamMember[]>(this.loadFromStorage());

  data$ = this._dataSubject.asObservable();

  constructor() {
    this.saveToStorage(this._dataSubject.value);
  }

  protected readonly _availablePageSizes = [3, 10, 20, 50];

  protected readonly _columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: 'name',
      id: 'name',
      header: 'Name',
      cell: (info) => {
        const member = info.row.original;
        return `
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">
              ${member.avatar}
            </div>
            <span class="font-medium text-gray-900">${member.name}</span>
          </div>
        `;
      },
    },
    {
      accessorKey: 'status',
      id: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue<string>();
        return `
          <div class="items-center gap-1.5 rounded-[16px] pt-[6px] pr-[9px] pb-[6px] pl-[6px] bg-[#ECFDF3] inline-flex">
            <span class="h-2 w-2 rounded-full bg-green-500"></span>
            <span class="text-sm leading-4 text-[#027A48]">${status}</span>
          </div>
        `;
      },
    },
    {
      accessorKey: 'role',
      id: 'role',
      header: 'Role',
      cell: (info) => `<span class="text-sm text-gray-600">${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'email',
      id: 'email',
      header: 'Email address',
      cell: (info) => `<span class="text-sm text-gray-600">${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'teams',
      id: 'teams',
      header: 'Teams',
      cell: (info) => {
        const teams = info.getValue<string[]>();
        const extraTeams = info.row.original.extraTeams;
        const colors: Record<string, string> = {
          Design: 'bg-[#F9F5FF] text-[#6941C6]',
          Product: 'bg-[#EFF8FF] text-[#175CD3]',
          Marketing: 'bg-[#EEF4FF] text-[#3538CD]',
        };

        const badges = teams
          .map(
            (team) =>
              `<span class="inline-flex items-center border px-2 text-xs font-medium rounded-[16px] pt-[2px] pr-[8px] pb-[2px] pl-[8px] ${
                colors[team] || 'bg-gray-50 text-gray-700 border-gray-200'
              }">${team}</span>`
          )
          .join('');
        return `
          <div class="flex items-center gap-1.5">
            ${badges}
            <span class="text-sm text-gray-500">+${extraTeams}</span>
          </div>
        `;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => info.row.original.id, // just pass the id
    },
  ];

  private readonly _sorting = signal<SortingState>([]);
  private readonly _pagination = signal<PaginationState>({
    pageSize: 3,
    pageIndex: 0,
  });

  data = signal<TeamMember[]>(this.loadFromStorage());

  pagination = signal({
    pageIndex: 0,
    pageSize: 5,
  });

  protected readonly _table = createAngularTable<TeamMember>(() => ({
    data: this.data(),
    columns: this._columns,
    state: {
      sorting: this._sorting(),
      pagination: this.pagination(),
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      this.pagination.update((old) => (typeof updater === 'function' ? updater(old) : updater));
    },
  }));

  // --- CRUD ---
  deleteMember(id: string) {
    this.data.update((d) => d.filter((m) => m.id !== id));
    this.saveToStorage(this.data());
    console.log('deleted');
  }

  updateMember(id: string) {
    console.log('Update logic here for member:', id);
  }

  // --- LocalStorage helpers ---
  private saveToStorage(data: TeamMember[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private loadFromStorage(): TeamMember[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : TEAM_MEMBERS_DATA;
  }

  // --- Pagination helpers ---
  protected getPageNumbers(): (number | string)[] {
    const pageCount = this._table.getPageCount();
    const currentPage = this._table.getState().pagination.pageIndex + 1;
    const pages: (number | string)[] = [];

    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(pageCount - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < pageCount - 2) {
        pages.push('...');
      }
      pages.push(pageCount);
    }

    return pages;
  }

  protected isActivePage(page: number | string): boolean {
    if (typeof page === 'string') return false;
    return this._table.getState().pagination.pageIndex === page - 1;
  }

  protected goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this._table.setPageIndex(page - 1);
    }
  }
}

// const TEAM_MEMBERS_DATA: TeamMember[] = [
//   {
//     id: '1',
//     name: 'Farouk Muhammed',
//     avatar: 'FM',
//     status: 'Active',
//     role: 'Product Designer',
//     email: 'olivia@untitledui.com',
//     teams: ['Design', 'Product', 'Marketing'],
//     extraTeams: 4,
//   },
//   {
//     id: '2',
//     name: 'Saliu Hammed',
//     avatar: 'SH',
//     status: 'Active',
//     role: 'Product Designer',
//     email: 'olivia@untitledui.com',
//     teams: ['Design', 'Product', 'Marketing'],
//     extraTeams: 4,
//   },
//   {
//     id: '3',
//     name: 'Ahmed Ibrahim',
//     avatar: 'AI',
//     status: 'Active',
//     role: 'Frontend Developer',
//     email: 'ahmed@untitledui.com',
//     teams: ['Design', 'Product', 'Marketing'],
//     extraTeams: 4,
//   },
// ];

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
