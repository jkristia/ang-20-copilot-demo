import { ApiProperty } from '@nestjs/swagger';

export class SetRunDurationDto {
    @ApiProperty({ example: 7 })
    run_duration!: number;
}
