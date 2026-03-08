import { computed, signal } from '@angular/core';

import {
  DataGridColumnSchema,
  type DataGridColumnStateResolver,
} from './datagrid-schema';

export interface GenericDatagridStoreOptions<TRow extends object> {
  schema: readonly DataGridColumnSchema<TRow>[];
  rows: readonly TRow[];
}

export abstract class GenericDatagridStore<TRow extends object> {
  private readonly _schema = signal<readonly DataGridColumnSchema<TRow>[]>([]);
  private readonly _rows = signal<readonly TRow[]>([]);
  private readonly _schemaByField = computed(() => {
    const byField = new Map<Extract<keyof TRow, string>, DataGridColumnSchema<TRow>>();
    for (const column of this._schema()) {
      byField.set(column.fieldName, column);
    }
    return byField;
  });

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

  protected withUpdatedField(
    row: TRow,
    field: string,
    value: unknown,
  ): TRow {
    const column = this.getColumnByField(field);
    if (!column || !this.isEditable(column, row)) {
      return row;
    }

    const fieldName = column.fieldName;
    const currentValue = row[fieldName];
    const nextValue = this.toNormalizedValue(column, value, currentValue);
    if (nextValue === currentValue) {
      return row;
    }

    return {
      ...row,
      [fieldName]: nextValue,
    } as TRow;
  }

  protected isEditable(column: DataGridColumnSchema<TRow>, row: TRow): boolean {
    const isReadOnly = this.resolveColumnState(column.readOnly, row);
    const isDisabled = this.resolveColumnState(column.disabled, row);
    return !(isReadOnly || isDisabled);
  }

  protected resolveColumnState(
    state: DataGridColumnStateResolver<TRow> | undefined,
    row: TRow,
  ): boolean {
    if (typeof state === 'function') {
      return state(row);
    }

    return Boolean(state);
  }

  protected toNormalizedValue(
    column: DataGridColumnSchema<TRow>,
    value: unknown,
    currentValue: TRow[Extract<keyof TRow, string>],
  ): TRow[Extract<keyof TRow, string>] {
    switch (column.fieldType) {
      case 'int': {
        const parsed = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
        if (!Number.isFinite(parsed)) {
          return currentValue;
        }

        let normalized = Math.trunc(parsed);
        if (column.min !== undefined) {
          normalized = Math.max(column.min, normalized);
        }
        if (column.max !== undefined) {
          normalized = Math.min(column.max, normalized);
        }

        return normalized as TRow[Extract<keyof TRow, string>];
      }
      case 'float': {
        const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));
        if (!Number.isFinite(parsed)) {
          return currentValue;
        }

        let normalized = parsed;
        if (column.min !== undefined) {
          normalized = Math.max(column.min, normalized);
        }
        if (column.max !== undefined) {
          normalized = Math.min(column.max, normalized);
        }

        return normalized as TRow[Extract<keyof TRow, string>];
      }
      case 'bool': {
        return typeof value === 'boolean'
          ? (value as TRow[Extract<keyof TRow, string>])
          : currentValue;
      }
      case 'ipv4':
      case 'mac':
      case 'string':
      case 'enum': {
        return typeof value === 'string'
          ? (value as TRow[Extract<keyof TRow, string>])
          : currentValue;
      }
      default:
        return currentValue;
    }
  }

  private getColumnByField(field: string): DataGridColumnSchema<TRow> | undefined {
    return this._schemaByField().get(field as Extract<keyof TRow, string>);
  }
}
