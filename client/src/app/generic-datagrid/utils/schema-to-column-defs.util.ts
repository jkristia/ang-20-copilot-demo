import { ColDef } from 'ag-grid-community';

import { DataGridColumnSchema } from '../datagrid-schema';
import {
  DataGridColumnColDefMapper,
  SchemaColumnToColDefUtil,
} from './schema-column-to-col-def.util';

const FILLER_COLUMN_ID = '__filler__';

export class SchemaToColumnDefsUtil<TRow extends object> {
  public constructor(
    private readonly columnMapper: DataGridColumnColDefMapper<TRow> = new SchemaColumnToColDefUtil<TRow>(),
  ) {}

  public toColumnDefs(schema: readonly DataGridColumnSchema<TRow>[]): ColDef<TRow>[] {
    const mappedColumns = schema.map((column) => this.columnMapper.toColDef(column));
    return [...mappedColumns, this.toFillerColumnDef()];
  }

  private toFillerColumnDef(): ColDef<TRow> {
    return {
      colId: FILLER_COLUMN_ID,
      headerName: '',
      flex: 1,
      minWidth: 24,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMovable: true,
      valueGetter: () => '',
    };
  }
}
