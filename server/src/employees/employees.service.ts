import { Injectable } from '@nestjs/common';
import { Employee, EmployeeDetail, PaginatedResponse, UpdateEmployeeDetailDto } from '@blog/shared';
import { DataAccessService } from '../data-access';

@Injectable()
export class EmployeesService {
  private readonly tableName = 'employees';
  private readonly detailsTableName = 'employee_details';

  constructor(private readonly dataAccess: DataAccessService) {}

  public findAll(skip: number = 0, take: number = 1000): PaginatedResponse<Employee> {
    const result = this.dataAccess.readTablePaginated<Employee>(
      this.tableName,
      skip,
      take
    );

    return {
      data: result.data,
      total: result.total,
      skip,
      take,
    };
  }

  public findOne(id: number): Employee | undefined {
    const allEmployees = this.dataAccess.readTable<Employee>(this.tableName);
    return allEmployees.find(emp => emp.id === id);
  }

  public findAllDetails(skip: number = 0, take: number = 1000): PaginatedResponse<EmployeeDetail> {
    const result = this.dataAccess.readTablePaginated<EmployeeDetail>(
      this.detailsTableName,
      skip,
      take
    );

    return {
      data: result.data,
      total: result.total,
      skip,
      take,
    };
  }

  public findDetailByEmployeeId(employeeId: number): EmployeeDetail | undefined {
    const allDetails = this.dataAccess.readTable<EmployeeDetail>(this.detailsTableName);
    return allDetails.find(detail => detail.employee_id === employeeId);
  }

  /**
   * Update an employee detail record
   * Returns the updated detail and optionally the updated employee if name changed
   */
  public updateDetail(
    employeeId: number,
    updates: UpdateEmployeeDetailDto
  ): { detail: EmployeeDetail; employee?: Employee } | undefined {
    // Validate: first_name and last_name cannot be empty if provided
    if (updates.first_name !== undefined && !updates.first_name.trim()) {
      throw new Error('First name cannot be empty');
    }
    if (updates.last_name !== undefined && !updates.last_name.trim()) {
      throw new Error('Last name cannot be empty');
    }

    // Update the detail record
    const updatedDetail = this.dataAccess.updateRecord<EmployeeDetail>(
      this.detailsTableName,
      'employee_id',
      employeeId,
      updates as Partial<EmployeeDetail>
    );

    if (!updatedDetail) {
      return undefined;
    }

    // If first_name or last_name changed, update the employees table as well
    let updatedEmployee: Employee | undefined;
    if (updates.first_name !== undefined || updates.last_name !== undefined) {
      const employeeUpdates: Partial<Employee> = {};
      if (updates.first_name !== undefined) {
        employeeUpdates.first_name = updates.first_name;
        // Also update email to reflect new name
        employeeUpdates.email = `${updates.first_name.toLowerCase()}.${updatedDetail.last_name.toLowerCase()}${employeeId}@company.com`;
      }
      if (updates.last_name !== undefined) {
        employeeUpdates.last_name = updates.last_name;
        // Also update email to reflect new name
        const firstName = updates.first_name ?? updatedDetail.first_name;
        employeeUpdates.email = `${firstName.toLowerCase()}.${updates.last_name.toLowerCase()}${employeeId}@company.com`;
      }

      updatedEmployee = this.dataAccess.updateRecord<Employee>(
        this.tableName,
        'id',
        employeeId,
        employeeUpdates
      );
    }

    return { detail: updatedDetail, employee: updatedEmployee };
  }
}
