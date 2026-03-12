import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
  ModuleRegistry,
  themeBalham,
} from 'ag-grid-community';

import { DataGrid2LinkStateRendererComponent } from './editors/link-state-cell-renderer.component';
import { DataGrid2Row } from './datagrid-2-schema';
import { DataGrid2Store } from './datagrid-2.store';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-datagrid-2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridAngular],
  templateUrl: './datagrid-2.component.html',
  styleUrl: './datagrid-2.component.scss',
})
export class DataGrid2Component {
  private readonly store = inject(DataGrid2Store);

  public readonly isLoading = signal(true);
  public readonly error = signal<string | null>(null);

  public readonly rows = this.store.rows;

  public readonly theme = themeBalham;

  public readonly columnDefs: ColDef<DataGrid2Row>[] = [
    {
      field: 'device',
      headerName: 'Device',
      width: 180,
      editable: false,
      pinned: 'left',
    },
    {
      field: 'linkState',
      headerName: 'Link State',
      width: 140,
      editable: false,
      cellStyle: { textAlign: 'center' },
      cellRenderer: DataGrid2LinkStateRendererComponent,
    },
    {
      field: 'ip',
      headerName: 'IP',
      width: 170,
      cellStyle: { justifyContent: 'flex-end' },
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: 'mask',
      headerName: 'Mask',
      width: 100,
      editable: false,
      cellStyle: { justifyContent: 'flex-end' },
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: 'gateway',
      headerName: 'Gateway',
      width: 170,
      cellStyle: { justifyContent: 'flex-end' },
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: 'mac',
      headerName: 'MAC',
      width: 180,
      cellStyle: { justifyContent: 'flex-end' },
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: 'dhcpEnabled',
      headerName: 'DHCP',
      width: 100,
      cellStyle: { justifyContent: 'center' },
      valueFormatter: (p) => (p.value ? 'Yes' : 'No'),
    },
    {
      field: 'txPackets',
      headerName: 'TX Packets',
      width: 130,
      cellStyle: { justifyContent: 'flex-end' },
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: 'signalStrength',
      headerName: 'Signal (dBm)',
      width: 130,
      cellStyle: { justifyContent: 'flex-end' },
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: 'dnsServer',
      headerName: 'DNS Server',
      width: 150,
      cellStyle: { justifyContent: 'flex-end' },
      headerClass: 'ag-right-aligned-header',
    },
    {
      flex: 1,
      sortable: false,
      filter: false,
      resizable: false,
    },
  ];

  public readonly defaultColDef: ColDef<DataGrid2Row> = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  public readonly getRowId = (params: GetRowIdParams<DataGrid2Row>): string =>
    params.data.rowId;

  public constructor() {
    this.loadData();
  }

  public onCellValueChanged(event: CellValueChangedEvent<DataGrid2Row>): void {
    if (event.data && event.colDef.field) {
      this.store.updateField(event.data.rowId, event.colDef.field, event.newValue);
    }
  }

  public retryLoad(): void {
    this.error.set(null);
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);
    this.store
      .loadData()
      .then(() => {
        this.isLoading.set(false);
      })
      .catch((err: unknown) => {
        this.isLoading.set(false);
        this.error.set('Failed to load device data. Please try again.');
        console.error(err);
      });
  }
}
