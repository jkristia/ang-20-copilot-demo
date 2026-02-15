import { ApiProperty } from '@nestjs/swagger';

export class EmployeeDto {
    @ApiProperty({ example: 1 })
    id!: number;

    @ApiProperty({ example: 'Jane' })
    first_name!: string;

    @ApiProperty({ example: 'Doe' })
    last_name!: string;

    @ApiProperty({ example: 'jane.doe1@company.com' })
    email!: string;

    @ApiProperty({ example: 'Engineering' })
    department!: string;

    @ApiProperty({ example: 'Software Engineer' })
    job_title!: string;

    @ApiProperty({ example: '2020-01-15' })
    hire_date!: string;

    @ApiProperty({ example: 90000 })
    salary!: number;

    @ApiProperty({ example: 'Active' })
    status!: string;

    @ApiProperty({ example: 'New York' })
    location!: string;

    @ApiProperty({ example: 5, nullable: true })
    manager_id!: number | null;

    @ApiProperty({ example: 4 })
    performance_rating!: number;
}
