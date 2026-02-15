import { ApiProperty } from '@nestjs/swagger';
import { EmployeeDto } from './employee.dto';

export class PaginatedEmployeesDto {
    @ApiProperty({ type: [EmployeeDto] })
    data!: EmployeeDto[];

    @ApiProperty({ example: 1000 })
    total!: number;

    @ApiProperty({ example: 0 })
    skip!: number;

    @ApiProperty({ example: 100 })
    take!: number;
}
