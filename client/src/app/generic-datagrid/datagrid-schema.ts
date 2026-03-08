export type DataGridFieldType =
  | 'bool'
  | 'int'
  | 'float'
  | 'string'
  | 'enum'
  | 'ipv4'
  | 'mac';

export type DataGridColumnAlignment = 'left' | 'center' | 'right';

export interface DataGridColumnSchema<TRow extends object = Record<string, unknown>> {
  fieldName: Extract<keyof TRow, string>;
  fieldType: DataGridFieldType;
  caption: string;
  width: number | 'auto';
  alignment?: DataGridColumnAlignment;
}
