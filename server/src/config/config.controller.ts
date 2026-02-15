import { Controller, Get, Put, Body, Inject, forwardRef, ConflictException } from '@nestjs/common';
import { ConfigService } from './config.service';
import type { IDemoConfig } from '../../../shared/src/model.interfaces';
import { AppGateway } from '../app.gateway';
import { RunningStateService } from './running-state.service';

@Controller('config')
export class ConfigController {
  constructor(
    private readonly configService: ConfigService,
    private readonly runningStateService: RunningStateService,
    @Inject(forwardRef(() => AppGateway))
    private readonly appGateway: AppGateway,
  ) { }

  @Get()
  getConfig(): IDemoConfig {
    return this.configService.getConfig();
  }

  @Put()
  updateConfig(@Body() updates: Partial<IDemoConfig>): IDemoConfig {
    if (!this.runningStateService.isIdle()) {
      throw new ConflictException('Config update rejected: system is running');
    }
    const updatedConfig = this.configService.updateConfig(updates);
    this.appGateway.emitConfigUpdate(updatedConfig);
    return updatedConfig;
  }
}
