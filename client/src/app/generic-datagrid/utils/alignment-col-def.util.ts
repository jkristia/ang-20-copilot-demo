import { ColDef } from 'ag-grid-community';

import {
  DataGridColumnAlignment,
  DataGridFieldType,
} from '../datagrid-schema';

export interface DataGridAlignmentColDefMapper {
  toColDef<TRow extends object>(
    fieldType: DataGridFieldType,
    alignment?: DataGridColumnAlignment,
  ): Pick<ColDef<TRow>, 'headerClass'>;
}

export class AlignmentColDefUtil implements DataGridAlignmentColDefMapper {
  public toColDef<TRow extends object>(
    fieldType: DataGridFieldType,
    alignment?: DataGridColumnAlignment,
  ): Pick<ColDef<TRow>, 'headerClass'> {
    const resolvedAlignment = alignment ?? this.toDefaultAlignment(fieldType);

    return {
      headerClass: this.toHeaderClass(resolvedAlignment),
    };
  }

  private toHeaderClass(alignment: DataGridColumnAlignment): string {
    switch (alignment) {
      case 'center':
        return 'gd-header-center';
      case 'right':
        return 'gd-header-right';
      case 'left':
      default:
        return 'gd-header-left';
    }
  }

  private toDefaultAlignment(fieldType: DataGridFieldType): DataGridColumnAlignment {
    return fieldType === 'string' ? 'left' : 'right';
  }
}
