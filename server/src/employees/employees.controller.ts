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
import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Employee, EmployeeDetail, PaginatedResponse } from '@blog/shared';
import { EmployeesService } from './employees.service';
import { AppGateway } from '../app.gateway';
import { EmployeeDto } from './dto/employee.dto';
import { EmployeeDetailDto } from './dto/employee-detail.dto';
import { PaginatedEmployeesDto } from './dto/paginated-employees.dto';
import { PaginatedEmployeeDetailsDto } from './dto/paginated-employee-details.dto';
import { UpdateEmployeeDetailDto as UpdateEmployeeDetailBodyDto } from './dto/update-employee-detail.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    @Inject(forwardRef(() => AppGateway))
    private readonly appGateway: AppGateway,
  ) { }

  @Get()
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiQuery({ name: 'take', required: false, example: 100 })
  @ApiOkResponse({ type: PaginatedEmployeesDto })
  public findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(1000), ParseIntPipe) take: number,
  ): PaginatedResponse<Employee> {
    return this.employeesService.findAll(skip, take);
  }

  @Get('details')
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiQuery({ name: 'take', required: false, example: 100 })
  @ApiOkResponse({ type: PaginatedEmployeeDetailsDto })
  public findAllDetails(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(1000), ParseIntPipe) take: number,
  ): PaginatedResponse<EmployeeDetail> {
    return this.employeesService.findAllDetails(skip, take);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: EmployeeDto })
  public findOne(@Param('id', ParseIntPipe) id: number): Employee | undefined {
    return this.employeesService.findOne(id);
  }

  @Get(':id/details')
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: EmployeeDetailDto })
  public findDetailByEmployeeId(@Param('id', ParseIntPipe) id: number): EmployeeDetail | undefined {
    return this.employeesService.findDetailByEmployeeId(id);
  }

  @Patch(':id/details')
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateEmployeeDetailBodyDto })
  @ApiOkResponse({ type: EmployeeDetailDto })
  @ApiBadRequestResponse({ description: 'First name or last name cannot be empty' })
  @ApiNotFoundResponse({ description: 'Employee detail not found' })
  public updateDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() updates: UpdateEmployeeDetailBodyDto,
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
