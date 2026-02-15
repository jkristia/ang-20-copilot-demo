import { 
  Controller, 
  Get, 
  Patch, 
  Param, 
  Query, 
  Body,
  ParseIntPipe, 
  DefaultValuePipe,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import type { Employee, EmployeeDetail, PaginatedResponse, UpdateEmployeeDetailDto } from '@blog/shared';
import { EmployeesService } from './employees.service';
import { AppGateway } from '../app.gateway';

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    @Inject(forwardRef(() => AppGateway))
    private readonly appGateway: AppGateway,
  ) {}

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

  @Patch(':id/details')
  public updateDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() updates: UpdateEmployeeDetailDto,
  ): EmployeeDetail {
    try {
      const result = this.employeesService.updateDetail(id, updates);
      
      if (!result) {
        throw new NotFoundException(`Employee detail with id ${id} not found`);
      }

      // Broadcast the update to all connected clients
      this.appGateway.emitEmployeeDetailUpdate(result.detail);
      
      // If employee was also updated (name change), broadcast that too
      if (result.employee) {
        this.appGateway.emitEmployeeUpdate(result.employee);
      }

      return result.detail;
    } catch (error) {
      if (error instanceof Error && error.message.includes('cannot be empty')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
