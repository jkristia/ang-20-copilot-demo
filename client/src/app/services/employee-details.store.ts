import { Injectable, inject, signal, computed } from '@angular/core';
import { EmployeeDetail, UpdateEmployeeDetailDto } from '@blog/shared';
import { EmployeeService } from './employee.service';
import { WebSocketService } from './websocket.service';

/**
 * Result of an update operation
 */
export interface UpdateResult {
  success: boolean;
  error?: string;
}

/**
 * Store for employee details state management.
 * Handles data loading, WebSocket sync, and updates.
 * Components should use this store instead of direct HTTP/WebSocket access.
 */
@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailsStore {
  private readonly employeeService = inject(EmployeeService);
  private readonly wsService = inject(WebSocketService);

  // Private writable signals
  private readonly _details = signal<EmployeeDetail[]>([]);
  private readonly _totalCount = signal<number>(0);
  private readonly _loading = signal<boolean>(false);
  private readonly _initialized = signal<boolean>(false);

  // Public readonly signals
  public readonly details = this._details.asReadonly();
  public readonly totalCount = this._totalCount.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly initialized = this._initialized.asReadonly();

  constructor() {
    this.subscribeToWebSocketUpdates();
  }

  /**
   * Load employee details from the server.
   * Safe to call multiple times - will reload data.
   */
  public load(): void {
    this._loading.set(true);
    
    this.employeeService.getEmployeeDetails({}).subscribe({
      next: (response) => {
        this._details.set(response.data);
        this._totalCount.set(response.total);
        this._loading.set(false);
        this._initialized.set(true);
      },
      error: (err) => {
        console.error('Failed to load employee details', err);
        this._loading.set(false);
      },
    });
  }

  /**
   * Update a single field on an employee detail record.
   * Returns a promise indicating success/failure.
   */
  public async updateField(
    employeeId: number,
    field: string,
    newValue: unknown,
    oldValue: unknown
  ): Promise<UpdateResult> {
    // Validate first_name and last_name cannot be empty
    if ((field === 'first_name' || field === 'last_name') && !String(newValue).trim()) {
      const fieldName = field === 'first_name' ? 'First name' : 'Last name';
      // Revert the local change
      this.updateLocalRecord(employeeId, { [field]: oldValue });
      return { success: false, error: `${fieldName} cannot be empty` };
    }

    // Build the update DTO
    const updates: UpdateEmployeeDetailDto = {
      [field]: newValue,
    };

    return new Promise((resolve) => {
      this.employeeService.updateEmployeeDetail(employeeId, updates).subscribe({
        next: () => {
          // Success - WebSocket will broadcast to all clients including this one
          resolve({ success: true });
        },
        error: (err) => {
          console.error('Failed to update employee detail', err);
          // Revert the local change on error
          this.updateLocalRecord(employeeId, { [field]: oldValue });
          resolve({ success: false, error: 'Failed to save changes' });
        },
      });
    });
  }

  /**
   * Update a local record (used for optimistic updates and reverts)
   */
  public updateLocalRecord(employeeId: number, updates: Partial<EmployeeDetail>): void {
    this._details.update(details =>
      details.map(d => d.employee_id === employeeId ? { ...d, ...updates } : d)
    );
  }

  /**
   * Get a single detail record by employee ID
   */
  public getById(employeeId: number): EmployeeDetail | undefined {
    return this._details().find(d => d.employee_id === employeeId);
  }

  /**
   * Subscribe to WebSocket updates for real-time sync
   */
  private subscribeToWebSocketUpdates(): void {
    this.wsService.onEmployeeDetailUpdated().subscribe((updatedDetail) => {
      this._details.update(details =>
        details.map(d => d.employee_id === updatedDetail.employee_id ? updatedDetail : d)
      );
    });
  }
}
