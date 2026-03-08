import { Component, computed, input } from '@angular/core';
import { ColDef } from 'ag-grid-community';

import {
  DataGridComponent,
  DataGridConfig,
} from '../components/data-grid/data-grid.component';
import { DataGridColumnSchema } from './datagrid-schema';
import {
  resolveGenericDatagridOptions,
  toGenericDatagridThemeVariables,
  type GenericDatagridOptions,
} from './generic-datagrid.theme';
import { SchemaToColumnDefsUtil } from './utils/schema-to-column-defs.util';

export type { GenericDatagridOptions } from './generic-datagrid.theme';

@Component({
  selector: 'app-generic-datagrid',
  standalone: true,
  imports: [DataGridComponent],
  templateUrl: './generic-datagrid.component.html',
  styleUrl: './generic-datagrid.component.scss',
})
export class GenericDatagridComponent<TRow extends object = Record<string, unknown>> {
  public readonly schema = input.required<readonly DataGridColumnSchema<TRow>[]>();
  public readonly rows = input.required<readonly TRow[]>();
  public readonly rowCountLabel = input<string>('Rows');
  public readonly options = input<GenericDatagridOptions>({});

  private readonly schemaToColumnDefsUtil = new SchemaToColumnDefsUtil<TRow>();

  public readonly columnDefs = computed<ColDef<TRow>[]>(() =>
    this.schemaToColumnDefsUtil.toColumnDefs(this.schema()),
  );

  public readonly rowData = computed<TRow[]>(() => [...this.rows()]);

  public readonly resolvedOptions = computed<Required<GenericDatagridOptions>>(() => {
    return resolveGenericDatagridOptions(this.options());
  });

  public readonly gridThemeVariables = computed<Record<string, string>>(() => {
    return toGenericDatagridThemeVariables(this.resolvedOptions());
  });

  public readonly gridConfig = computed<DataGridConfig<TRow>>(() => ({
    columnDefs: this.columnDefs(),
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
    },
    rowSelection: 'single',
    rowHeight: 40,
  }));
}
