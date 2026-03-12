import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { DataGrid2LinkState, DataGrid2Row } from '../datagrid-2-schema';

@Component({
  selector: 'app-datagrid-2-link-state-renderer',
  standalone: true,
  template: `
    <span [class]="'link-state-cell ' + dotClass">
      <span [class]="'dot ' + dotClass" [attr.aria-label]="value ?? 'unknown'"></span>
    </span>
  `,
  styleUrl: './link-state-cell-renderer.component.scss',
})
export class DataGrid2LinkStateRendererComponent implements ICellRendererAngularComp {
  public value: DataGrid2LinkState | undefined;
  public dotClass = 'unknown';

  public agInit(params: ICellRendererParams<DataGrid2Row, DataGrid2LinkState>): void {
    this.value = params.value ?? undefined;
    this.dotClass = this.toDotClass(params.value);
  }

  public refresh(params: ICellRendererParams<DataGrid2Row, DataGrid2LinkState>): boolean {
    this.agInit(params);
    return true;
  }

  private toDotClass(value: DataGrid2LinkState | null | undefined): string {
    switch (value) {
      case 'Connected':
        return 'connected';
      case 'Disconnected':
        return 'disconnected';
      case 'Unknown':
        return 'unknown';
      default:
        return 'unknown';
    }
  }
}
