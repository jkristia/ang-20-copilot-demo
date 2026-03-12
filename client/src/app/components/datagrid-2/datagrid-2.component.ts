import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  CellMouseDownEvent,
  CellMouseOverEvent,
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  themeBalham,
} from 'ag-grid-community';

import { DataGrid2LinkStateRendererComponent } from './editors/link-state-cell-renderer.component';
import { DataGrid2Row } from './datagrid-2-schema';
import { DataGrid2Store } from './datagrid-2.store';

ModuleRegistry.registerModules([AllCommunityModule]);

interface CellRange {
  startRow: number;
  endRow: number;
  startColIdx: number;
  endColIdx: number;
}

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

  private gridApi: GridApi<DataGrid2Row> | null = null;
  private isSelecting = false;
  private selectedRanges: CellRange[] = [];
  private activeRangeIndex = -1;

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
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      headerClass: 'ag-center-aligned-header',
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
    cellClassRules: {
      'cell-readonly': (params) => params.colDef.editable === false,
      'cell-range-selected': (params) =>
        this.isCellInRange(params.rowIndex ?? -1, params.column.getColId()),
    },
  };

  // enable cell range select
  // public readonly rowSelection = { mode: 'multiRow' } as const;

  public readonly getRowId = (params: GetRowIdParams<DataGrid2Row>): string =>
    params.data.rowId;

  public constructor() {
    this.loadData();
    document.addEventListener('mouseup', () => {
      this.isSelecting = false;
    });
  }

  public onGridReady(event: GridReadyEvent<DataGrid2Row>): void {
    this.gridApi = event.api;
  }

  public onCellMouseDown(event: CellMouseDownEvent<DataGrid2Row>): void {
    if (event.rowIndex === null) return;
    const colIdx = this.getColIndex(event.column.getColId());
    const nativeEvent = event.event as MouseEvent;
    const isShift = nativeEvent?.shiftKey;
    const isCtrl = nativeEvent?.ctrlKey || nativeEvent?.metaKey;

    if (isShift && this.selectedRanges.length > 0) {
      // extend the active range's end point
      const active = this.selectedRanges[this.activeRangeIndex];
      this.selectedRanges[this.activeRangeIndex] = { ...active, endRow: event.rowIndex, endColIdx: colIdx };
    } else if (isCtrl) {
      // TODO fix cmdclick selection
      // cmd+click on a single-cell selection toggles it off
      // cmd+click inside a multi-cell range does nothing (can't punch a hole in a rectangle)
      const singleCellIdx = this.selectedRanges.findIndex((r) => {
        const minRow = Math.min(r.startRow, r.endRow);
        const maxRow = Math.max(r.startRow, r.endRow);
        const minCol = Math.min(r.startColIdx, r.endColIdx);
        const maxCol = Math.max(r.startColIdx, r.endColIdx);
        return minRow === maxRow && minCol === maxCol && minRow === event.rowIndex && minCol === colIdx;
      });
      if (singleCellIdx >= 0) {
        this.selectedRanges.splice(singleCellIdx, 1);
        this.activeRangeIndex = this.selectedRanges.length - 1;
      } else {
        const isInMultiCellRange = this.selectedRanges.some((r) => this.isCellInRangeObj(r, event.rowIndex!, colIdx));
        if (!isInMultiCellRange) {
          this.isSelecting = true;
          this.selectedRanges.push({ startRow: event.rowIndex, endRow: event.rowIndex, startColIdx: colIdx, endColIdx: colIdx });
          this.activeRangeIndex = this.selectedRanges.length - 1;
        }
      }
    } else {
      // plain click — clear all, start fresh
      this.isSelecting = true;
      this.selectedRanges = [{ startRow: event.rowIndex, endRow: event.rowIndex, startColIdx: colIdx, endColIdx: colIdx }];
      this.activeRangeIndex = 0;
    }
    this.gridApi?.refreshCells({ force: true });
  }

  public onCellMouseOver(event: CellMouseOverEvent<DataGrid2Row>): void {
    if (!this.isSelecting || event.rowIndex === null || this.activeRangeIndex < 0) return;
    const colIdx = this.getColIndex(event.column.getColId());
    const active = this.selectedRanges[this.activeRangeIndex];
    this.selectedRanges[this.activeRangeIndex] = { ...active, endRow: event.rowIndex, endColIdx: colIdx };
    this.gridApi?.refreshCells({ force: true });
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

  private getColIndex(colId: string): number {
    const cols = this.gridApi?.getColumns() ?? [];
    return cols.findIndex((c) => c.getColId() === colId);
  }

  private isCellInRange(rowIndex: number, colId: string): boolean {
    if (rowIndex < 0 || this.selectedRanges.length === 0) return false;
    const colIdx = this.getColIndex(colId);
    return this.selectedRanges.some((r) => this.isCellInRangeObj(r, rowIndex, colIdx));
  }

  private isCellInRangeObj(range: CellRange, rowIndex: number, colIdx: number): boolean {
    const minRow = Math.min(range.startRow, range.endRow);
    const maxRow = Math.max(range.startRow, range.endRow);
    const minCol = Math.min(range.startColIdx, range.endColIdx);
    const maxCol = Math.max(range.startColIdx, range.endColIdx);
    return rowIndex >= minRow && rowIndex <= maxRow && colIdx >= minCol && colIdx <= maxCol;
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
