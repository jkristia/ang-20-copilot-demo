import { Injectable, inject, signal } from '@angular/core';
import { Employee } from '@blog/shared';
import { EmployeeService } from './employee.service';
import { WebSocketService } from './websocket.service';

/**
 * Store for employees state management.
 * Handles data loading and WebSocket sync.
 * Components should use this store instead of direct HTTP/WebSocket access.
 */
@Injectable({
  providedIn: 'root'
})
export class EmployeesStore {
  private readonly employeeService = inject(EmployeeService);
  private readonly wsService = inject(WebSocketService);

  // Private writable signals
  private readonly _employees = signal<Employee[]>([]);
  private readonly _totalCount = signal<number>(0);
  private readonly _loading = signal<boolean>(false);
  private readonly _initialized = signal<boolean>(false);

  // Public readonly signals
  public readonly employees = this._employees.asReadonly();
  public readonly totalCount = this._totalCount.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly initialized = this._initialized.asReadonly();

  constructor() {
    this.subscribeToWebSocketUpdates();
  }

  /**
   * Load employees from the server.
   * Safe to call multiple times - will reload data.
   */
  public load(): void {
    this._loading.set(true);
    
    this.employeeService.getEmployees({}).subscribe({
      next: (response) => {
        this._employees.set(response.data);
        this._totalCount.set(response.total);
        this._loading.set(false);
        this._initialized.set(true);
      },
      error: (err) => {
        console.error('Failed to load employees', err);
        this._loading.set(false);
      },
    });
  }

  /**
   * Get a single employee by ID
   */
  public getById(id: number): Employee | undefined {
    return this._employees().find(e => e.id === id);
  }

  /**
   * Subscribe to WebSocket updates for real-time sync
   */
  private subscribeToWebSocketUpdates(): void {
    this.wsService.onEmployeeUpdated().subscribe((updatedEmployee) => {
      this._employees.update(employees =>
        employees.map(e => e.id === updatedEmployee.id ? updatedEmployee : e)
      );
    });
  }
}
