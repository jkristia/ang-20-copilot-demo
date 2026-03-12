import { Injectable } from '@angular/core';

import { GenericDatagridStore } from '../../generic-datagrid/generic-datagrid.store';
import { DEFAULT_DATAGRID_2_ROW_COUNT, dataGrid2DataUtil } from './datagrid-2-data';
import { DataGrid2Row, DATAGRID_2_SCHEMA } from './datagrid-2-schema';

@Injectable({
  providedIn: 'root',
})
export class DataGrid2Store extends GenericDatagridStore<DataGrid2Row> {
  public constructor() {
    super({
      schema: DATAGRID_2_SCHEMA,
      rows: [],
    });
  }

  protected getRowData(rowCount = DEFAULT_DATAGRID_2_ROW_COUNT): readonly DataGrid2Row[] {
    return dataGrid2DataUtil.generate(rowCount);
  }

  public async loadData(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 200));
    this.setRows(dataGrid2DataUtil.generate());
  }

  public updateField(rowId: string, field: string, value: unknown): void {
    const nextRows = this.rows().map((row) =>
      row.rowId === rowId ? this.toUpdatedRow(row, field, value) : row,
    );
    this.setRows(nextRows);
  }

  private toUpdatedRow(row: DataGrid2Row, field: string, value: unknown): DataGrid2Row {
    const updatedRow = this.withUpdatedField(row, field, value);
    return updatedRow === row ? { ...row } : updatedRow;
  }
}
