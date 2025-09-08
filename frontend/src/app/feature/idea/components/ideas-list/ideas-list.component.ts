import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { QueryParamType } from '@core/api/api.model';
import { AuthStore } from '@core/auth/data-access/auth.store';
import { TranslatePipe } from '@core/data-access';
import { Idea } from '@core/idea/models/idea.model';
import { IdeaStatusBadgeComponent } from '@pattern/idea-status/components/idea-status-badge.component';
import { RadioFilterComponent } from '@pattern/radio-filter/radio.filter.component';
import { FilterOption } from '@pattern/radio-filter/types';
import { GenericTableComponent } from '@ui/components/table/generic-table.component';
import {
  SortEvnt,
  TableColumn,
} from '@ui/components/table/table-types.interface';
import { TruncatePipe } from '@ui/pipes/truncate.pipe';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { IdeaStore } from '../../services/idea.store';
import { CategoryNamePipe } from '../../utils/category-name.pipe';
import { COLUMNS } from './const';

const Options: FilterOption[] = [
  {
    label: 'ideas-filter-all',
    value: 'all',
    title: 'ideas-filter-all-title',
  },
  {
    label: 'ideas-filter-yours',
    value: 'only_yours',
    title: 'ideas-filter-yours-title',
  },
  {
    label: 'ideas-filter-others',
    value: 'only_others',
    title: 'ideas-filter-others-title',
  },
];

@Component({
  selector: 'ba-ideas-list',
  templateUrl: './ideas-list.component.html',
  imports: [
    GenericTableComponent,
    TitleCasePipe,
    MenuModule,
    ButtonModule,
    IdeaStatusBadgeComponent,
    DropdownModule,
    FormsModule,
    TableModule,
    TitleCasePipe,
    TranslatePipe,
    MatTooltipModule,
    RadioFilterComponent,
    TruncatePipe,
    CategoryNamePipe,
  ],
})
export class IdeasListComponent {
  protected readonly store = inject(IdeaStore);
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected columns = signal<TableColumn[]>(COLUMNS).asReadonly();

  protected readonly ideasFilterOptions = Options;

  onCreate() {
    this.router.navigate(['/app/ideas/create']);
  }

  onEdit(id: number) {
    this.router.navigate([`/app/ideas/${id}/edit`]);
  }

  onView(id: number) {
    this.router.navigate([`/app/ideas/${id}/detail`]);
  }

  onReview(id: number) {
    this.router.navigate([`/app/ideas/${id}/review`]);
  }

  onFilter(filter: QueryParamType | null) {
    if (filter === null) {
      this.store.resetQueryParams();
      return;
    }

    this.store.setQueryParams(filter);
  }

  onSort(event: SortEvnt) {
    this.store.setQueryParams({ [event.field]: event.value });
  }

  isIdeaOwner(idea: Idea, userId: string) {
    return idea.submitterId === userId;
  }
}
