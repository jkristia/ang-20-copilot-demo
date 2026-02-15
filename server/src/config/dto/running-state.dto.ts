import { ApiProperty } from '@nestjs/swagger';
import { RunningStateEnum } from '../../../../shared/src/model.interfaces';

export class RunningStateDto {
    @ApiProperty({ enum: RunningStateEnum, example: RunningStateEnum.IDLE })
    state!: RunningStateEnum;

    @ApiProperty({ example: 5 })
    run_duration!: number;

    @ApiProperty({ example: 0 })
    elapsed_seconds!: number;
}
