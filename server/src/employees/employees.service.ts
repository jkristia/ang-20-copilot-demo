import { Injectable } from '@nestjs/common';
import { Employee, PaginatedResponse } from '@blog/shared';
import { DataAccessService } from '../data-access';

@Injectable()
export class EmployeesService {
  private readonly tableName = 'employees';

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
}
