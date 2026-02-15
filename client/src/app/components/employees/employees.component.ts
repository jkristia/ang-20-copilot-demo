import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColDef } from 'ag-grid-community';
import { Employee } from '@blog/shared';
import { EmployeeService } from '../../services/employee.service';
import { DataGridComponent, DataGridConfig } from '../data-grid/data-grid.component';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    DataGridComponent,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesListComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  public readonly employees = signal<Employee[]>([]);
  public readonly totalCount = signal<number>(0);
  public readonly loading = signal<boolean>(false);
  public readonly selectedEmployee = signal<Employee | undefined>(undefined);

  /** Column definitions for the employee grid */
  private readonly columnDefs: ColDef<Employee>[] = [
    { field: 'id', headerName: 'ID', width: 80, flex: 0 },
    { field: 'first_name', headerName: 'First Name' },
    { field: 'last_name', headerName: 'Last Name' },
    { field: 'email', headerName: 'Email', minWidth: 200 },
    { field: 'department', headerName: 'Department' },
    { field: 'job_title', headerName: 'Job Title', minWidth: 150 },
    { field: 'hire_date', headerName: 'Hire Date', width: 120, flex: 0 },
    { 
      field: 'salary', 
      headerName: 'Salary',
      width: 110,
      flex: 0,
      valueFormatter: params => params.value ? `$${params.value.toLocaleString()}` : ''
    },
    { field: 'status', headerName: 'Status', width: 100, flex: 0 },
    { field: 'location', headerName: 'Location' },
    { 
      field: 'performance_rating', 
      headerName: 'Rating',
      width: 90,
      flex: 0,
      cellRenderer: (params: { value: number }) => {
        const rating = params.value;
        return rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '';
      }
    },
  ];

  /** Grid configuration */
  public readonly gridConfig = computed<DataGridConfig<Employee>>(() => ({
    columnDefs: this.columnDefs,
    rowSelection: 'single',
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
    },
  }));

  public ngOnInit(): void {
    this.loadEmployees();
  }

  public onRowSelected(employee: Employee | undefined): void {
    this.selectedEmployee.set(employee);
  }

  private loadEmployees(): void {
    this.loading.set(true);
    this.employeeService.getEmployees({ take: 1000 }).subscribe({
      next: (response) => {
        this.employees.set(response.data);
        this.totalCount.set(response.total);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load employees', err);
        this.loading.set(false);
      },
    });
  }
}
