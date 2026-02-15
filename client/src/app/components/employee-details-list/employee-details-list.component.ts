import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ColDef } from 'ag-grid-community';
import { EmployeeDetail } from '@blog/shared';
import { EmployeeDetailsStore } from '../../services/employee-details.store';
import { DataGridComponent, DataGridConfig, CellChange } from '../data-grid/data-grid.component';

@Component({
  selector: 'app-employee-details-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DataGridComponent,
  ],
  templateUrl: './employee-details-list.component.html',
  styleUrl: './employee-details-list.component.scss',
})
export class EmployeeDetailsListComponent implements OnInit {
  private readonly store = inject(EmployeeDetailsStore);
  private readonly snackBar = inject(MatSnackBar);

  // Expose store signals to template
  public readonly details = this.store.details;
  public readonly totalCount = this.store.totalCount;
  public readonly loading = this.store.loading;

  /** Column definitions for the employee details grid */
  private readonly columnDefs: ColDef<EmployeeDetail>[] = [
    { field: 'employee_id', headerName: 'ID', width: 70, flex: 0, editable: false },
    { field: 'first_name', headerName: 'First Name', width: 120, editable: true },
    { field: 'last_name', headerName: 'Last Name', width: 120, editable: true },
    { field: 'date_of_birth', headerName: 'DOB', width: 110, flex: 0, editable: true },
    { field: 'gender', headerName: 'Gender', width: 100, flex: 0, editable: true },
    { field: 'marital_status', headerName: 'Marital Status', width: 130, editable: true },
    { field: 'dependents', headerName: 'Dep.', width: 70, flex: 0, editable: true },
    { field: 'nationality', headerName: 'Nationality', width: 110, editable: true },
    { field: 'street_address', headerName: 'Address', minWidth: 150, editable: true },
    { field: 'city', headerName: 'City', width: 120, editable: true },
    { field: 'state', headerName: 'State', width: 70, flex: 0, editable: true },
    { field: 'postal_code', headerName: 'Zip', width: 80, flex: 0, editable: true },
    { field: 'mobile_phone', headerName: 'Mobile', width: 140, editable: true },
    { field: 'work_phone', headerName: 'Work Phone', width: 140, editable: true },
    { field: 'emergency_contact_name', headerName: 'Emergency Contact', minWidth: 150, editable: true },
    { field: 'emergency_contact_phone', headerName: 'Emergency Phone', width: 140, editable: true },
    { field: 'bank_name', headerName: 'Bank', width: 120, editable: true },
    { field: 'blood_type', headerName: 'Blood', width: 70, flex: 0, editable: true },
    { field: 'shirt_size', headerName: 'Shirt', width: 70, flex: 0, editable: true },
    { field: 'dietary_restrictions', headerName: 'Dietary', width: 100, editable: true },
    { field: 'allergies', headerName: 'Allergies', width: 100, editable: true },
  ];

  /** Grid configuration */
  public readonly gridConfig = computed<DataGridConfig<EmployeeDetail>>(() => ({
    columnDefs: this.columnDefs,
    rowSelection: 'single',
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
    },
    getRowId: (data) => data.employee_id,
  }));

  public ngOnInit(): void {
    // Load data if not already initialized
    if (!this.store.initialized()) {
      this.store.load();
    }
  }

  /** Handle cell value changes from the grid */
  public async onCellValueChanged(change: CellChange<EmployeeDetail>): Promise<void> {
    const { data, field, oldValue, newValue } = change;

    const result = await this.store.updateField(data.employee_id, field, newValue, oldValue);
    
    if (!result.success && result.error) {
      this.snackBar.open(result.error, 'OK', { duration: 3000 });
    }
  }
}
