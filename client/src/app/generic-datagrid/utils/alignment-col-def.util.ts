import { ColDef } from 'ag-grid-community';

import {
  DataGridColumnAlignment,
  DataGridFieldType,
} from '../datagrid-schema';

export interface DataGridAlignmentColDefMapper {
  toColDef<TRow extends object>(
    fieldType: DataGridFieldType,
    alignment?: DataGridColumnAlignment,
  ): Pick<ColDef<TRow>, 'cellStyle'>;
}

export class AlignmentColDefUtil implements DataGridAlignmentColDefMapper {
  public toColDef<TRow extends object>(
    fieldType: DataGridFieldType,
    alignment?: DataGridColumnAlignment,
  ): Pick<ColDef<TRow>, 'cellStyle'> {
    const resolvedAlignment = alignment ?? this.toDefaultAlignment(fieldType);

    return {
      cellStyle: this.toCellStyle(resolvedAlignment),
    };
  }

  private toDefaultAlignment(fieldType: DataGridFieldType): DataGridColumnAlignment {
    return fieldType === 'string' ? 'left' : 'right';
  }

  private toCellStyle(alignment: DataGridColumnAlignment): {
    textAlign: 'left' | 'center' | 'right';
    justifyContent: 'flex-start' | 'center' | 'flex-end';
  } {
    switch (alignment) {
      case 'center':
        return {
          textAlign: 'center',
          justifyContent: 'center',
        };
      case 'right':
        return {
          textAlign: 'right',
          justifyContent: 'flex-end',
        };
      case 'left':
      default:
        return {
          textAlign: 'left',
          justifyContent: 'flex-start',
        };
    }
  }
}
