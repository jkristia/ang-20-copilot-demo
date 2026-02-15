import { Component, inject, signal, OnInit, OnDestroy, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ColDef } from 'ag-grid-community';
import { EmployeeDetail, UpdateEmployeeDetailDto } from '@blog/shared';
import { EmployeeService } from '../../services/employee.service';
import { WebSocketService } from '../../services/websocket.service';
import { DataGridComponent, DataGridConfig, CellChange } from '../data-grid/data-grid.component';
import { Subject, takeUntil } from 'rxjs';

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
export class EmployeeDetailsListComponent implements OnInit, OnDestroy {
  private readonly employeeService = inject(EmployeeService);
  private readonly wsService = inject(WebSocketService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroy$ = new Subject<void>();

  @ViewChild(DataGridComponent) private dataGrid?: DataGridComponent<EmployeeDetail>;

  public readonly details = signal<EmployeeDetail[]>([]);
  public readonly totalCount = signal<number>(0);
  public readonly loading = signal<boolean>(false);

  /** Editable columns - empty first_name/last_name not allowed */
  private readonly editableFields = [
    'first_name', 'last_name', 'date_of_birth', 'gender', 'marital_status',
    'nationality', 'street_address', 'city', 'state', 'postal_code',
    'mobile_phone', 'work_phone', 'emergency_contact_name', 'emergency_contact_phone',
    'emergency_contact_relationship', 'bank_name', 'blood_type', 'shirt_size',
    'dietary_restrictions', 'allergies', 'notes'
  ];

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
    this.loadDetails();
    this.subscribeToUpdates();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDetails(): void {
    this.loading.set(true);
    this.employeeService.getEmployeeDetails({ take: 1000 }).subscribe({
      next: (response) => {
        this.details.set(response.data);
        this.totalCount.set(response.total);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load employee details', err);
        this.loading.set(false);
      },
    });
  }

  /** Subscribe to WebSocket updates from other clients */
  private subscribeToUpdates(): void {
    this.wsService.onEmployeeDetailUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedDetail) => {
        // Update the grid row
        this.dataGrid?.updateRowData(updatedDetail.employee_id, updatedDetail);
        // Also update the signal data
        this.details.update(details => 
          details.map(d => d.employee_id === updatedDetail.employee_id ? updatedDetail : d)
        );
      });
  }

  /** Handle cell value changes from the grid */
  public onCellValueChanged(change: CellChange<EmployeeDetail>): void {
    const { data, field, oldValue, newValue } = change;

    // Validate first_name and last_name cannot be empty
    if ((field === 'first_name' || field === 'last_name') && !String(newValue).trim()) {
      this.snackBar.open(`${field === 'first_name' ? 'First name' : 'Last name'} cannot be empty`, 'OK', { duration: 3000 });
      // Revert the change
      this.dataGrid?.updateRowData(data.employee_id, { [field]: oldValue } as Partial<EmployeeDetail>);
      return;
    }

    // Build the update DTO
    const updates: UpdateEmployeeDetailDto = {
      [field]: newValue,
    };

    // Call API to save the change
    this.employeeService.updateEmployeeDetail(data.employee_id, updates).subscribe({
      next: () => {
        // Success - update already applied locally, WebSocket will broadcast to others
      },
      error: (err) => {
        console.error('Failed to update employee detail', err);
        this.snackBar.open('Failed to save changes', 'OK', { duration: 3000 });
        // Revert the change on error
        this.dataGrid?.updateRowData(data.employee_id, { [field]: oldValue } as Partial<EmployeeDetail>);
      },
    });
  }
}
