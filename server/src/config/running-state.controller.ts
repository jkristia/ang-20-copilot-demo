import { Controller, Get, Put, Post, Body } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { IRunningState } from '../../../shared/src/model.interfaces';
import { RunningStateService } from './running-state.service';
import { RunningStateDto } from './dto/running-state.dto';
import { SetRunDurationDto } from './dto/set-run-duration.dto';

@ApiTags('RunningState')
@Controller('running-state')
export class RunningStateController {
    constructor(private readonly runningStateService: RunningStateService) { }

    @Get()
    @ApiOkResponse({ type: RunningStateDto })
    getState(): IRunningState {
        return this.runningStateService.getState();
    }

    @Put('duration')
    @ApiBody({ type: SetRunDurationDto })
    @ApiOkResponse({ type: RunningStateDto })
    setDuration(@Body('run_duration') runDuration: number): IRunningState {
        return this.runningStateService.setDuration(runDuration);
    }

    @Post('start')
    @ApiCreatedResponse({ type: RunningStateDto })
    start(): IRunningState {
        return this.runningStateService.start();
    }
}
