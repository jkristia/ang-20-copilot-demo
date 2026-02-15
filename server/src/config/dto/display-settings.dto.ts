import { ApiProperty } from '@nestjs/swagger';
import { ThemeEnum } from '../../../../shared/src/model.interfaces';

export class DisplaySettingsDto {
    @ApiProperty({ example: false })
    dark_mode!: boolean;

    @ApiProperty({ example: 14 })
    font_size!: number;

    @ApiProperty({ example: true })
    show_animations!: boolean;

    @ApiProperty({ enum: ThemeEnum, example: ThemeEnum.SYSTEM })
    theme!: ThemeEnum;
}
