import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { User, UserStatus } from '../../core/models/user';
import { MockDataService } from '../../core/services/mock-data-service';

const STATUS_BADGE: Record<UserStatus, string> = {
  active: 'badge--success',
  invited: 'badge--warning',
  suspended: 'badge--danger',
};

// Case-insensitive match on the visible text columns
function matchesFilter(user: User, filter: string): boolean {
  return [user.name, user.email, user.role, user.status].some((value) =>
    value.toLowerCase().includes(filter),
  );
}

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements AfterViewInit {
  private readonly data = inject(MockDataService);

  // viewChild() returns a signal; `required` means it is always present after view init
  private readonly sort = viewChild.required(MatSort);
  private readonly paginator = viewChild.required(MatPaginator);

  protected readonly columns = ['name', 'email', 'role', 'status', 'joined'];
  protected readonly pageSizes = [5, 10, 25];

  // MatTableDataSource does client-side filtering, sorting and paging for us
  protected readonly dataSource = new MatTableDataSource<User>(this.data.users());

  protected readonly filter = signal('');
  private readonly normalizedFilter = computed(() => this.filter().trim().toLowerCase());
  protected readonly matchCount = computed(() => {
    const filter = this.normalizedFilter();
    return this.data.users().filter((user) => matchesFilter(user, filter)).length;
  });

  // Headline numbers above the table
  protected readonly statusCounts = computed(() => {
    const users = this.data.users();
    const count = (status: UserStatus) => users.filter((u) => u.status === status).length;
    return [
      { label: 'Total', value: users.length },
      { label: 'Active', value: count('active') },
      { label: 'Invited', value: count('invited') },
      { label: 'Suspended', value: count('suspended') },
    ];
  });

  constructor() {
    this.dataSource.filterPredicate = matchesFilter;
  }

  ngAfterViewInit(): void {
    // Sort and paginator only exist once the template is rendered
    this.dataSource.sort = this.sort();
    this.dataSource.paginator = this.paginator();
  }

  protected applyFilter(value: string): void {
    this.filter.set(value);
    this.dataSource.filter = this.normalizedFilter();
    this.paginator().firstPage();
  }

  protected clearFilter(): void {
    this.applyFilter('');
  }

  protected initials(user: User): string {
    return user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  // Typed helper: mat-table row variables are untyped in the template
  protected statusBadge(user: User): string {
    return STATUS_BADGE[user.status];
  }
}
