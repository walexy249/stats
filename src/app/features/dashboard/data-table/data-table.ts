import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
// import { lucideChevronDown, lucideTrash2, lucideEdit, lucideFilter } from '@ng-icons/lucide';
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
    FlexRenderDirective,
    FormsModule,
    HlmButtonImports,
    NgIcon,
    HlmIconImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmTableImports,
  ],
  // providers: [provideIcons({ lucideChevronDown, lucideTrash2, lucideEdit, lucideFilter })],
  templateUrl: './data-table.html',
})
export class DataTableComponent {
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
      header: () => `
        <div class="flex items-center gap-1">
          <span>Status</span>
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      `,
      cell: (info) => {
        const status = info.getValue<string>();
        return `
          <div class=" items-center gap-1.5 rounded-[16px] pt-[6px] pr-[9px] pb-[6px] pl-[6px] bg-[#ECFDF3] inline-flex">
            <span class="h-2 w-2 rounded-full bg-green-500"></span>
            <span class="text-sm leading-4 text-[#027A48]">${status}</span>
          </div>
        `;
      },
    },
    {
      accessorKey: 'role',
      id: 'role',
      header: () => `
        <div class="flex items-center gap-1">
          <span>Role</span>
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      `,
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
      header: '',
      cell: () => `
        <div class="flex items-center justify-end gap-1">
          <button class="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100">
            <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button class="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100">
            <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      `,
    },
  ];

  private readonly _sorting = signal<SortingState>([]);
  private readonly _pagination = signal<PaginationState>({
    pageSize: 3,
    pageIndex: 0,
  });

  protected readonly _table = createAngularTable<TeamMember>(() => ({
    data: TEAM_MEMBERS_DATA,
    columns: this._columns,
    state: {
      sorting: this._sorting(),
      pagination: this._pagination(),
    },
    onSortingChange: (updater) => {
      updater instanceof Function ? this._sorting.update(updater) : this._sorting.set(updater);
    },
    onPaginationChange: (updater) => {
      updater instanceof Function
        ? this._pagination.update(updater)
        : this._pagination.set(updater);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  }));

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
