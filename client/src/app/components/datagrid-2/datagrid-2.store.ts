import { Injectable, signal } from '@angular/core';

import { dataGrid2DataUtil } from './datagrid-2-data';
import { DataGrid2Row } from './datagrid-2-schema';

@Injectable({
  providedIn: 'root',
})
export class DataGrid2Store {
  public readonly rows = signal<DataGrid2Row[]>([]);

  public async loadData(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 200));
    this.rows.set(dataGrid2DataUtil.generate());
  }

  public updateField(rowId: string, field: string, value: unknown): void {
    this.rows.update((rows) =>
      rows.map((row) => (row.rowId === rowId ? { ...row, [field]: value } : row)),
    );
  }
}
