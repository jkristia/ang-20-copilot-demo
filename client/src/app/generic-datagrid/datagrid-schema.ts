import { ColDef } from 'ag-grid-community';

export type DataGridFieldType =
  | 'bool'
  | 'int'
  | 'float'
  | 'string'
  | 'enum'
  | 'ipv4'
  | 'mac';

export type DataGridColumnAlignment = 'left' | 'center' | 'right';

export type DataGridColumnStateResolver<TRow extends object> =
  | boolean
  | ((row: TRow) => boolean);

export interface DataGridColumnSchema<TRow extends object = Record<string, unknown>> {
  fieldName: Extract<keyof TRow, string>;
  fieldType: DataGridFieldType;
  caption: string;
  width: number | 'auto';
  alignment?: DataGridColumnAlignment;
  min?: number;
  max?: number;
  readOnly?: DataGridColumnStateResolver<TRow>;
  disabled?: DataGridColumnStateResolver<TRow>;
  cellRenderer?: ColDef<TRow>['cellRenderer'];
  cellRendererParams?: ColDef<TRow>['cellRendererParams'];
  cellEditor?: ColDef<TRow>['cellEditor'];
  cellEditorParams?: ColDef<TRow>['cellEditorParams'];
}
