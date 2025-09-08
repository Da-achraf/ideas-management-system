import { DatePipe, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import {
  Component,
  computed,
  contentChildren,
  inject,
  input,
  OnInit,
  output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  PAGE_SIZE,
  TranslatePipe,
  TranslationService,
} from '@core/data-access';
import { Button } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Table, TableModule } from 'primeng/table';
import { QueryParamType } from '../../../core/api/api.model';
import { BaButtonComponent } from '../button/button.component';
import { LoadingComponent } from '../loading/loading.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { SearchBarComponent } from '../search/search-bar.component';
import { convertPrimeNgMatchModeToBackendOperator } from './generic-table.util';
import { SortEvnt, TableColumn } from './table-types.interface';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'ba-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
  imports: [
    TableModule,
    Button,
    SearchBarComponent,
    PaginatorComponent,
    NgTemplateOutlet,
    DatePipe,
    TitleCasePipe,
    BaButtonComponent,
    LoadingComponent,
    MenuModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    TranslatePipe,
  ],
})
export class GenericTableComponent implements OnInit {
  templates = contentChildren<TemplateRef<any>>(TemplateRef);

  readonly data = input<any[]>([]);
  readonly total = input.required<number>();
  readonly columns = input<TableColumn[]>([]);
  readonly globalFilterFields = input<string[]>([]);
  readonly pageSizeOptions = input([25, 50, 100, 200]);
  readonly loading = input(true);

  readonly withCreate = input(false);
  readonly showActionsColumn = input(true);
  readonly showClearButton = input(true);

  page = output<number>();
  pageSize = output<number>();

  create = output<void>();
  search = output<string>();
  sort = output<SortEvnt>();
  filter = output<QueryParamType | null>();

  columnsLength = computed(() => this.columns().length);

  private readonly size = inject(PAGE_SIZE);
  protected translationService = inject(TranslationService);

  ngOnInit(): void {
    this.page.emit(1);
    this.pageSize.emit(this.size);
  }

  getTableDataTemplate(column: any): TemplateRef<any> | null {
    const template = this.templates().find(
      (t: any) => t['_declarationTContainer'].localNames[0] === column.template
    );
    return template || null;
  }

  getTemplate(name: any): TemplateRef<any> | null {
    const template = this.templates().find(
      (t: any) => t['_declarationTContainer'].localNames[0] === name
    );
    return template || null;
  }

  getFilterTemplate(column: any): TemplateRef<any> | null {
    const template = this.templates().find(
      (t: any) =>
        t['_declarationTContainer'].localNames[0] === column.filterTemplate
    );
    return template || null;
  }

  clear(table: Table) {
    table.clear();
    this.filter.emit(null);
  }

  onFilter(event: any) {
    const filters = event.filters;
    console.log('filters before parsing: ', filters);
    const queryParams: { [key: string]: string } = {};

    for (const field in filters) {
      if (filters.hasOwnProperty(field)) {
        const filter = filters[field];

        // Handle array filters (most fields)
        if (Array.isArray(filter)) {
          filter.forEach((singleFilter: any) => {
            if (
              singleFilter.value !== null &&
              singleFilter.value !== undefined &&
              singleFilter.value !== ''
            ) {
              const paramKey = `${field
                .split('.')
                .join('__')}__${convertPrimeNgMatchModeToBackendOperator(
                singleFilter.matchMode
              )}`;
              queryParams[paramKey] = this.formatFilterValue(
                singleFilter.value
              );
            }
          });
        }

        // Handle direct object filters (like validation)
        else if (
          filter.value !== null &&
          filter.value !== undefined &&
          filter.value !== ''
        ) {
          const paramKey = `${field
            .split('.')
            .join('__')}__${convertPrimeNgMatchModeToBackendOperator(
            filter.matchMode
          )}`;
          queryParams[paramKey] = this.formatFilterValue(filter.value);
        }
      }
    }

    // If no query params build
    if (!Object.keys(queryParams).length) {
      this.filter.emit(null);
      return;
    }

    this.filter.emit(queryParams);
  }

  private formatFilterValue(value: any): string {
    // Format dates to ISO string (without time if it's a date-only filter)
    if (value instanceof Date) {
      return value.toISOString();
    }

    return String(value);
  }

  onSearch(term: string) {
    this.search.emit(term);
  }

  onSort(event: SortEvent) {
    const sort: SortEvnt = {
      field: `sort__${event.field}`,
      value: `${event.order === 1 ? `asc` : `desc`}`,
    };

    this.sort.emit(sort);
  }
}
