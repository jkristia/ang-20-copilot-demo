import { Controller, Get, Put, Body, Inject, forwardRef, ConflictException } from '@nestjs/common';
import { ApiBody, ApiConflictResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import type { IDemoConfig } from '../../../shared/src/model.interfaces';
import { AppGateway } from '../app.gateway';
import { RunningStateService } from './running-state.service';
import { DemoConfigDto } from './dto/demo-config.dto';
import { UpdateDemoConfigDto } from './dto/update-demo-config.dto';

@ApiTags('Config')
@Controller('config')
export class ConfigController {
  constructor(
    private readonly configService: ConfigService,
    private readonly runningStateService: RunningStateService,
    @Inject(forwardRef(() => AppGateway))
    private readonly appGateway: AppGateway,
  ) { }

  @Get()
  @ApiOkResponse({ type: DemoConfigDto })
  getConfig(): IDemoConfig {
    return this.configService.getConfig();
  }

  @Put()
  @ApiBody({ type: UpdateDemoConfigDto })
  @ApiOkResponse({ type: DemoConfigDto })
  @ApiConflictResponse({ description: 'Config update rejected: system is running' })
  updateConfig(@Body() updates: UpdateDemoConfigDto): IDemoConfig {
    if (!this.runningStateService.isIdle()) {
      throw new ConflictException('Config update rejected: system is running');
    }
    const updatedConfig = this.configService.updateConfig(updates);
    this.appGateway.emitConfigUpdate(updatedConfig);
    return updatedConfig;
  }
}
