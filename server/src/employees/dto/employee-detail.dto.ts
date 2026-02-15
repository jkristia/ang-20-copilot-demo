import { ApiProperty } from '@nestjs/swagger';

export class EmployeeDetailDto {
    @ApiProperty({ example: 1 })
    employee_id!: number;

    @ApiProperty({ example: 'Jane' })
    first_name!: string;

    @ApiProperty({ example: 'Doe' })
    last_name!: string;

    @ApiProperty({ example: '1990-04-12' })
    date_of_birth!: string;

    @ApiProperty({ example: 'Female' })
    gender!: string;

    @ApiProperty({ example: 'Single' })
    marital_status!: string;

    @ApiProperty({ example: 0 })
    dependents!: number;

    @ApiProperty({ example: 'USA' })
    nationality!: string;

    @ApiProperty({ example: '***-**-1234' })
    ssn!: string;

    @ApiProperty({ example: '123 Main St' })
    street_address!: string;

    @ApiProperty({ example: 'New York' })
    city!: string;

    @ApiProperty({ example: 'NY' })
    state!: string;

    @ApiProperty({ example: '10001' })
    postal_code!: string;

    @ApiProperty({ example: 'USA' })
    country!: string;

    @ApiProperty({ example: '555-555-0000' })
    home_phone!: string;

    @ApiProperty({ example: '555-555-0001' })
    mobile_phone!: string;

    @ApiProperty({ example: '555-555-0002' })
    work_phone!: string;

    @ApiProperty({ example: '1234' })
    work_extension!: string;

    @ApiProperty({ example: 'John Doe' })
    emergency_contact_name!: string;

    @ApiProperty({ example: '555-555-1111' })
    emergency_contact_phone!: string;

    @ApiProperty({ example: 'Spouse' })
    emergency_contact_relationship!: string;

    @ApiProperty({ example: 'Bank of Example' })
    bank_name!: string;

    @ApiProperty({ example: '****5678' })
    bank_account!: string;

    @ApiProperty({ example: '*****111' })
    routing_number!: string;

    @ApiProperty({ example: '***-**-4321' })
    tax_id!: string;

    @ApiProperty({ example: 'D1234567' })
    drivers_license!: string;

    @ApiProperty({ example: 'NY' })
    drivers_license_state!: string;

    @ApiProperty({ example: 'O+' })
    blood_type!: string;

    @ApiProperty({ example: 'None' })
    medical_conditions!: string;

    @ApiProperty({ example: 'Peanuts' })
    allergies!: string;

    @ApiProperty({ example: 'Vegetarian' })
    dietary_restrictions!: string;

    @ApiProperty({ example: 'M' })
    shirt_size!: string;

    @ApiProperty({ example: '' })
    notes!: string;
}
