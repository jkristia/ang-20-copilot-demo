import { Component, input, output, computed } from '@angular/core';
import { NgStyle } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { 
  ColDef, 
  GridReadyEvent, 
  GridApi, 
  RowSelectedEvent, 
  CellValueChangedEvent,
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  themeAlpine,
  themeBalham,
  themeMaterial,
} from 'ag-grid-community';

// Register all AG Grid community modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Available AG Grid themes - change SELECTED_THEME to switch
const AG_GRID_THEMES = {
  quartz: themeQuartz,      // Modern flat design, hamburger menu filter icon
  alpine: themeAlpine,      // Clean look, funnel filter icon
  balham: themeBalham,      // Compact, traditional funnel filter icon
  material: themeMaterial,  // Material Design style
};

// *** CHANGE THIS TO SWITCH THEMES: 'quartz' | 'alpine' | 'balham' | 'material' ***
const SELECTED_THEME: keyof typeof AG_GRID_THEMES = 'balham';

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
  imports: [AgGridAngular, NgStyle],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [ngStyle]="themeVariables()"
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
  styleUrl: './data-grid.component.scss',
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

  /** AG Grid theme variables applied at the theme root element */
  public readonly themeVariables = input<Record<string, string>>({});
  
  /** Event emitted when grid is ready */
  public readonly gridReady = output<GridApi<T>>();
  
  /** Event emitted when a row is selected */
  public readonly rowSelected = output<T | undefined>();

  /** Event emitted when a cell value changes */
  public readonly cellValueChanged = output<CellChange<T>>();

  /** AG Grid theme */
  public readonly theme = AG_GRID_THEMES[SELECTED_THEME];

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
    return this.config().rowSelection;
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
