import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColDef } from 'ag-grid-community';
import { EmployeeDetail } from '@blog/shared';
import { EmployeeService } from '../../services/employee.service';
import { DataGridComponent, DataGridConfig } from '../data-grid/data-grid.component';

@Component({
  selector: 'app-employee-details-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    DataGridComponent,
  ],
  templateUrl: './employee-details-list.component.html',
  styleUrl: './employee-details-list.component.scss',
})
export class EmployeeDetailsListComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  public readonly details = signal<EmployeeDetail[]>([]);
  public readonly totalCount = signal<number>(0);
  public readonly loading = signal<boolean>(false);

  /** Column definitions for the employee details grid */
  private readonly columnDefs: ColDef<EmployeeDetail>[] = [
    { field: 'employee_id', headerName: 'ID', width: 70, flex: 0 },
    { field: 'first_name', headerName: 'First Name', width: 120 },
    { field: 'last_name', headerName: 'Last Name', width: 120 },
    { field: 'date_of_birth', headerName: 'DOB', width: 110, flex: 0 },
    { field: 'gender', headerName: 'Gender', width: 100, flex: 0 },
    { field: 'marital_status', headerName: 'Marital Status', width: 130 },
    { field: 'dependents', headerName: 'Dep.', width: 70, flex: 0 },
    { field: 'nationality', headerName: 'Nationality', width: 110 },
    { field: 'street_address', headerName: 'Address', minWidth: 150 },
    { field: 'city', headerName: 'City', width: 120 },
    { field: 'state', headerName: 'State', width: 70, flex: 0 },
    { field: 'postal_code', headerName: 'Zip', width: 80, flex: 0 },
    { field: 'mobile_phone', headerName: 'Mobile', width: 140 },
    { field: 'work_phone', headerName: 'Work Phone', width: 140 },
    { field: 'emergency_contact_name', headerName: 'Emergency Contact', minWidth: 150 },
    { field: 'emergency_contact_phone', headerName: 'Emergency Phone', width: 140 },
    { field: 'bank_name', headerName: 'Bank', width: 120 },
    { field: 'blood_type', headerName: 'Blood', width: 70, flex: 0 },
    { field: 'shirt_size', headerName: 'Shirt', width: 70, flex: 0 },
    { field: 'dietary_restrictions', headerName: 'Dietary', width: 100 },
    { field: 'allergies', headerName: 'Allergies', width: 100 },
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
  }));

  public ngOnInit(): void {
    this.loadDetails();
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
}
