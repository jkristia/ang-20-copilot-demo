import { Controller, Get, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import type { Employee, EmployeeDetail, PaginatedResponse } from '@blog/shared';
import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  public findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(1000), ParseIntPipe) take: number,
  ): PaginatedResponse<Employee> {
    return this.employeesService.findAll(skip, take);
  }

  @Get('details')
  public findAllDetails(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(1000), ParseIntPipe) take: number,
  ): PaginatedResponse<EmployeeDetail> {
    return this.employeesService.findAllDetails(skip, take);
  }

  @Get(':id')
  public findOne(@Param('id', ParseIntPipe) id: number): Employee | undefined {
    return this.employeesService.findOne(id);
  }

  @Get(':id/details')
  public findDetailByEmployeeId(@Param('id', ParseIntPipe) id: number): EmployeeDetail | undefined {
    return this.employeesService.findDetailByEmployeeId(id);
  }
}
