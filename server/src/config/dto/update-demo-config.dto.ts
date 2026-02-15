import { ApiPropertyOptional } from '@nestjs/swagger';
import { SelectEnum } from '../../../../shared/src/model.interfaces';

export class UpdateDemoConfigDto {
    @ApiPropertyOptional({ example: true })
    enabled?: boolean;

    @ApiPropertyOptional({ example: 1.5 })
    float_value?: number;

    @ApiPropertyOptional({ example: 12 })
    int_value?: number;

    @ApiPropertyOptional({ example: 'Updated' })
    string_value?: string;

    @ApiPropertyOptional({ enum: SelectEnum, example: SelectEnum.value2 })
    select_value?: SelectEnum;
}
