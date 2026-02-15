import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
    @ApiProperty({ example: 'b5e1f6a1-2b6b-4b3f-9c0b-1234567890ab' })
    id!: string;

    @ApiProperty({ example: '2026-02-15T12:34:56.000Z' })
    date!: string;

    @ApiProperty({ example: 'NestJS Best Practices' })
    topic!: string;

    @ApiProperty({ example: 'This is a sample blog post message.' })
    message!: string;
}
