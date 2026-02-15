import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmployeeDetailDto {
    @ApiPropertyOptional({ example: 'Jane' })
    first_name?: string;

    @ApiPropertyOptional({ example: 'Doe' })
    last_name?: string;

    @ApiPropertyOptional({ example: '1990-04-12' })
    date_of_birth?: string;

    @ApiPropertyOptional({ example: 'Female' })
    gender?: string;

    @ApiPropertyOptional({ example: 'Single' })
    marital_status?: string;

    @ApiPropertyOptional({ example: 0 })
    dependents?: number;

    @ApiPropertyOptional({ example: 'USA' })
    nationality?: string;

    @ApiPropertyOptional({ example: '123 Main St' })
    street_address?: string;

    @ApiPropertyOptional({ example: 'New York' })
    city?: string;

    @ApiPropertyOptional({ example: 'NY' })
    state?: string;

    @ApiPropertyOptional({ example: '10001' })
    postal_code?: string;

    @ApiPropertyOptional({ example: '555-555-0001' })
    mobile_phone?: string;

    @ApiPropertyOptional({ example: '555-555-0002' })
    work_phone?: string;

    @ApiPropertyOptional({ example: 'John Doe' })
    emergency_contact_name?: string;

    @ApiPropertyOptional({ example: '555-555-1111' })
    emergency_contact_phone?: string;

    @ApiPropertyOptional({ example: 'Spouse' })
    emergency_contact_relationship?: string;

    @ApiPropertyOptional({ example: 'Bank of Example' })
    bank_name?: string;

    @ApiPropertyOptional({ example: 'O+' })
    blood_type?: string;

    @ApiPropertyOptional({ example: 'None' })
    medical_conditions?: string;

    @ApiPropertyOptional({ example: 'Peanuts' })
    allergies?: string;

    @ApiPropertyOptional({ example: 'Vegetarian' })
    dietary_restrictions?: string;

    @ApiPropertyOptional({ example: 'M' })
    shirt_size?: string;

    @ApiPropertyOptional({ example: '' })
    notes?: string;
}
