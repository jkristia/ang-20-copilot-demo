import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostBodyDto {
    @ApiPropertyOptional({ example: '2026-02-15T12:34:56.000Z' })
    date?: string;

    @ApiPropertyOptional({ example: 'Updated Topic' })
    topic?: string;

    @ApiPropertyOptional({ example: 'Updated message.' })
    message?: string;
}
