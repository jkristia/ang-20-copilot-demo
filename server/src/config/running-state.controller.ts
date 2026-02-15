import { Controller, Get, Put, Post, Body } from '@nestjs/common';
import type { IRunningState } from '../../../shared/src/model.interfaces';
import { RunningStateService } from './running-state.service';

@Controller('running-state')
export class RunningStateController {
    constructor(private readonly runningStateService: RunningStateService) { }

    @Get()
    getState(): IRunningState {
        return this.runningStateService.getState();
    }

    @Put('duration')
    setDuration(@Body('run_duration') runDuration: number): IRunningState {
        return this.runningStateService.setDuration(runDuration);
    }

    @Post('start')
    start(): IRunningState {
        return this.runningStateService.start();
    }
}
