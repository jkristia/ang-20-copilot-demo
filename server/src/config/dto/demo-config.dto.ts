import { ApiProperty } from '@nestjs/swagger';
import { SelectEnum } from '../../../../shared/src/model.interfaces';
import { NetworkSettingsDto } from './network-settings.dto';
import { DisplaySettingsDto } from './display-settings.dto';

export class DemoConfigDto {
    @ApiProperty({ example: false })
    enabled!: boolean;

    @ApiProperty({ example: 1.01 })
    float_value!: number;

    @ApiProperty({ example: 10 })
    int_value!: number;

    @ApiProperty({ example: '' })
    string_value!: string;

    @ApiProperty({ enum: SelectEnum, example: SelectEnum.value1 })
    select_value!: SelectEnum;

    @ApiProperty({ example: '2026-02-15T12:34:56.000Z' })
    last_changed!: string;

    @ApiProperty({ type: NetworkSettingsDto })
    network_settings!: NetworkSettingsDto;

    @ApiProperty({ type: DisplaySettingsDto })
    display_settings!: DisplaySettingsDto;
}
