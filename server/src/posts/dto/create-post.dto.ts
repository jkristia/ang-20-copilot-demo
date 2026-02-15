import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostBodyDto {
    @ApiPropertyOptional({ example: '2026-02-15T12:34:56.000Z' })
    date?: string;

    @ApiProperty({ example: 'NestJS Best Practices' })
    topic!: string;

    @ApiProperty({ example: 'This is a sample blog post message.' })
    message!: string;
}
