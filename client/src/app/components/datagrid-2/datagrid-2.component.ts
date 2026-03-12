import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { CellChange } from '../../generic-datagrid/data-grid/data-grid.component';
import {
  GenericDatagridComponent,
  GenericDatagridOptions,
} from '../../generic-datagrid/generic-datagrid.component';
import { DataGrid2Row } from './datagrid-2-schema';
import { DataGrid2Store } from './datagrid-2.store';

@Component({
  selector: 'app-datagrid-2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericDatagridComponent],
  templateUrl: './datagrid-2.component.html',
  styleUrl: './datagrid-2.component.scss',
})
export class DataGrid2Component {
  private readonly store = inject(DataGrid2Store);

  public readonly isLoading = signal(true);
  public readonly error = signal<string | null>(null);

  public readonly schema = this.store.schema;
  public readonly rows = this.store.rows;

  public readonly getRowId = (row: DataGrid2Row): string => row.rowId;

  public readonly gridOptions: Readonly<GenericDatagridOptions> = {
    verticalGridLines: false,
    horizontalGridLines: false,
  };

  public constructor() {
    this.loadData();
  }

  public onCellValueChanged(change: CellChange<DataGrid2Row>): void {
    this.store.updateField(change.data.rowId, change.field, change.newValue);
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
