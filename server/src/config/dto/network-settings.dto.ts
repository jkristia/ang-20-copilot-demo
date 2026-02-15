import { ApiProperty } from '@nestjs/swagger';
import { ConnectionModeEnum } from '../../../../shared/src/model.interfaces';

export class NetworkSettingsDto {
    @ApiProperty({ example: true })
    network_enabled!: boolean;

    @ApiProperty({ example: 30 })
    timeout_seconds!: number;

    @ApiProperty({ example: true })
    allow_retry!: boolean;

    @ApiProperty({ example: 3 })
    retry_count!: number;

    @ApiProperty({ enum: ConnectionModeEnum, example: ConnectionModeEnum.AUTO })
    connection_mode!: ConnectionModeEnum;
}
