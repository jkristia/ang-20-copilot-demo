import { Component, computed, inject } from '@angular/core';

import { CellChange } from '../../generic-datagrid/data-grid/data-grid.component';
import {
  GenericDatagridComponent,
  GenericDatagridOptions,
} from '../../generic-datagrid/generic-datagrid.component';
import { NetworkDeviceRow } from './network-device-schema';
import { NetworkDeviceStore } from './network-device.store';

@Component({
  selector: 'app-network-device-page',
  standalone: true,
  imports: [GenericDatagridComponent],
  templateUrl: './network-device-page.component.html',
  styleUrl: './network-device-page.component.scss',
})
export class NetworkDevicePageComponent {
  private readonly networkDeviceStore = inject(NetworkDeviceStore);

  public readonly getRowId = (row: NetworkDeviceRow): string => row.rowId;

  public readonly gridOptions: Readonly<GenericDatagridOptions> = {
    verticalGridLines: false,
    horizontalGridLines: false,
  };

  public readonly schema = this.networkDeviceStore.schema;
  public readonly allRows = this.networkDeviceStore.rows;
  public readonly previewRows = computed(() => this.allRows().slice(0, 5));

  public onGridCellValueChanged(change: CellChange<NetworkDeviceRow>): void {
    this.networkDeviceStore.updateField(change.data.rowId, change.field, change.newValue);
  }
}
