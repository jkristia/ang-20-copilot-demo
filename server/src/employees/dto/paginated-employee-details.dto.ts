import { ApiProperty } from '@nestjs/swagger';
import { EmployeeDetailDto } from './employee-detail.dto';

export class PaginatedEmployeeDetailsDto {
    @ApiProperty({ type: [EmployeeDetailDto] })
    data!: EmployeeDetailDto[];

    @ApiProperty({ example: 1000 })
    total!: number;

    @ApiProperty({ example: 0 })
    skip!: number;

    @ApiProperty({ example: 100 })
    take!: number;
}
