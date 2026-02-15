import { Component, input, output, computed } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { 
  ColDef, 
  GridReadyEvent, 
  GridApi, 
  RowSelectedEvent, 
  CellValueChangedEvent,
  ModuleRegistry, 
  AllCommunityModule 
} from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * Cell value change event with row data and field info
 */
export interface CellChange<T> {
  data: T;
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

/**
 * Configuration for the data grid component
 */
export interface DataGridConfig<T> {
  columnDefs: ColDef<T>[];
  defaultColDef?: ColDef<T>;
  rowSelection?: 'single' | 'multiple';
  rowHeight?: number;
  /** Get unique row ID for update operations */
  getRowId?: (data: T) => string | number;
}

/**
 * Reusable data grid component wrapping AG Grid.
 * Uses DOM virtualization for smooth scrolling with large datasets.
 */
@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [AgGridAngular],
  template: `
    <ag-grid-angular
      class="ag-theme-alpine"
      [rowData]="rowData()"
      [columnDefs]="config().columnDefs"
      [defaultColDef]="mergedDefaultColDef()"
      [rowSelection]="rowSelectionConfig()"
      [rowHeight]="config().rowHeight ?? 42"
      [suppressRowVirtualisation]="false"
      [animateRows]="true"
      [getRowId]="getRowIdFn()"
      [singleClickEdit]="true"
      [stopEditingWhenCellsLoseFocus]="true"
      (gridReady)="onGridReady($event)"
      (rowSelected)="onRowSelected($event)"
      (cellValueChanged)="onCellValueChanged($event)"
    />
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    
    ag-grid-angular {
      width: 100%;
      height: 100%;
    }
    
    /* Vertically center cell content */
    :host ::ng-deep .ag-cell {
      display: flex;
      align-items: center;
    }
  `]
})
export class DataGridComponent<T> {
  /** Input data rows */
  public readonly rowData = input.required<T[]>();
  
  /** Grid configuration */
  public readonly config = input.required<DataGridConfig<T>>();
  
  /** Total row count (for display purposes) */
  public readonly totalRows = input<number>(0);
  
  /** Loading state */
  public readonly loading = input<boolean>(false);
  
  /** Event emitted when grid is ready */
  public readonly gridReady = output<GridApi<T>>();
  
  /** Event emitted when a row is selected */
  public readonly rowSelected = output<T | undefined>();

  /** Event emitted when a cell value changes */
  public readonly cellValueChanged = output<CellChange<T>>();

  private gridApi?: GridApi<T>;

  /** Merged default column definition */
  public readonly mergedDefaultColDef = computed<ColDef<T>>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
    ...this.config().defaultColDef,
  }));

  /** Row selection configuration */
  public readonly rowSelectionConfig = computed(() => {
    const selection = this.config().rowSelection;
    if (!selection) return undefined;
    return {
      mode: selection as 'singleRow' | 'multiRow',
      enableClickSelection: true,
    };
  });

  /** Get row ID function for AG Grid */
  public readonly getRowIdFn = computed(() => {
    const fn = this.config().getRowId;
    if (!fn) return undefined;
    return (params: { data: T }) => String(fn(params.data));
  });

  public onGridReady(event: GridReadyEvent<T>): void {
    this.gridApi = event.api;
    this.gridReady.emit(event.api);
  }

  public onRowSelected(event: RowSelectedEvent<T>): void {
    if (event.node.isSelected()) {
      this.rowSelected.emit(event.data);
    }
  }

  public onCellValueChanged(event: CellValueChangedEvent<T>): void {
    if (event.data && event.colDef.field) {
      this.cellValueChanged.emit({
        data: event.data,
        field: event.colDef.field,
        oldValue: event.oldValue,
        newValue: event.newValue,
      });
    }
  }

  /** Update a row's data programmatically */
  public updateRowData(rowId: string | number, updates: Partial<T>): void {
    if (!this.gridApi) return;
    
    const rowNode = this.gridApi.getRowNode(String(rowId));
    if (rowNode && rowNode.data) {
      const newData = { ...rowNode.data, ...updates };
      rowNode.setData(newData);
    }
  }

  /** Resize columns to fit the grid width */
  public sizeColumnsToFit(): void {
    this.gridApi?.sizeColumnsToFit();
  }

  /** Auto-size all columns based on content */
  public autoSizeAllColumns(): void {
    this.gridApi?.autoSizeAllColumns();
  }
}
