import { signal } from '@angular/core';

import { DataGridColumnSchema } from './datagrid-schema';

export interface GenericDatagridStoreOptions<TRow extends object> {
  schema: readonly DataGridColumnSchema<TRow>[];
  rows: readonly TRow[];
}

export abstract class GenericDatagridStore<TRow extends object> {
  private readonly _schema = signal<readonly DataGridColumnSchema<TRow>[]>([]);
  private readonly _rows = signal<readonly TRow[]>([]);

  public readonly schema = this._schema.asReadonly();
  public readonly rows = this._rows.asReadonly();

  public constructor(options: GenericDatagridStoreOptions<TRow>) {
    this._schema.set(options.schema);
    this._rows.set(options.rows);
  }

  protected abstract getRowData(rowCount?: number): readonly TRow[];

  public setRows(rows: readonly TRow[]): void {
    this._rows.set(rows);
  }

  public resetRows(rowCount?: number): void {
    this._rows.set(this.getRowData(rowCount));
  }
}
