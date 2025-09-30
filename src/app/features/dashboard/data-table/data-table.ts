import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { TeamMemberService } from '../../../shared/service/team-member.service';
import { TeamMember } from '../../../shared/model/team-member.model';
import { AddMember } from './modal/add-member/add-member';

/**
 * DataTableComponent - Displays a sortable, paginated table of team members
 * Uses TanStack Angular Table for table functionality and Spartan UI components
 */
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
    AddMember,
  ],
  templateUrl: './data-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // Performance optimization - only check for changes when inputs change
})
export class DataTableComponent {
  // Inject Angular's change detector for manual change detection if needed
  private cdr = inject(ChangeDetectorRef);

  // Inject the team member service to manage data operations
  private teamService = inject(TeamMemberService);

  // Reference to the add/edit member modal component
  @ViewChild('memberModal')
  memberModal!: AddMember;

  constructor() {}

  // Available options for rows per page in pagination
  protected readonly _availablePageSizes = [3, 10, 20, 50];

  /**
   * Column definitions for the table
   * Each column specifies how data should be displayed and accessed
   */
  protected readonly _columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: 'name',
      id: 'name',
      header: 'Name',
      cell: (info) => {
        const member = info.row.original;
        // Render name with avatar circle containing initials
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
        // Render status badge with green indicator dot
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

        // Color mapping for different team types
        const colors: Record<string, string> = {
          Design: 'bg-[#F9F5FF] text-[#6941C6]',
          Product: 'bg-[#EFF8FF] text-[#175CD3]',
          Marketing: 'bg-[#EEF4FF] text-[#3538CD]',
        };

        // Render team badges with appropriate colors
        const badges = teams
          .map(
            (team) =>
              `<span class="inline-flex items-center border px-2 text-xs font-medium rounded-[16px] pt-[2px] pr-[8px] pb-[2px] pl-[8px] ${
                colors[team] || 'bg-gray-50 text-gray-700 border-gray-200'
              }">${team}</span>`
          )
          .join('');

        // Show first few teams and indicate additional teams count
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
      cell: (info) => info.row.original.id, // Returns member ID for action buttons
    },
  ];

  // Signal to track table sorting state
  private readonly _sorting = signal<SortingState>([]);

  // Signal to track pagination state (unused - see pagination below)
  private readonly _pagination = signal<PaginationState>({
    pageSize: 3,
    pageIndex: 0,
  });

  // Get team member data from service
  data = this.teamService.members;

  // Active pagination state signal
  pagination = signal({
    pageIndex: 0,
    pageSize: 5,
  });

  /**
   * Initialize TanStack table instance with configuration
   * Creates a reactive table that updates when data or state changes
   */
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
    // Handle pagination changes from table interactions
    onPaginationChange: (updater) => {
      this.pagination.update((old) => (typeof updater === 'function' ? updater(old) : updater));
    },
  }));

  deleteMember(id: string) {
    this.teamService.deleteMember(id);
  }

  addMember() {
    this.memberModal.openSheet('add', null);
  }

  editMember(id: string) {
    console.log(id);
    this.memberModal.openSheet('edit', id);
  }

  protected getPageNumbers(): (number | string)[] {
    const pageCount = this._table.getPageCount();
    const currentPage = this._table.getState().pagination.pageIndex + 1;
    const pages: (number | string)[] = [];

    // If 7 or fewer pages, show all page numbers
    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // For more than 7 pages, show smart pagination with ellipsis
      pages.push(1); // Always show first page

      // Add ellipsis if current page is far from start
      if (currentPage > 3) {
        pages.push('...');
      }

      // Show current page and surrounding pages
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(pageCount - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if current page is far from end
      if (currentPage < pageCount - 2) {
        pages.push('...');
      }

      pages.push(pageCount); // Always show last page
    }

    return pages;
  }

  protected isActivePage(page: number | string): boolean {
    if (typeof page === 'string') return false; // Ellipsis is never active
    return this._table.getState().pagination.pageIndex === page - 1;
  }

  protected goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this._table.setPageIndex(page - 1); // Convert to 0-indexed for table API
    }
  }
}
