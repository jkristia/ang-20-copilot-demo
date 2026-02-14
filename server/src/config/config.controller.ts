import { Controller, Get, Put, Body } from '@nestjs/common';
import { ConfigService } from './config.service';
import type { IDemoConfig } from '../../../shared/src/model.interfaces';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getConfig(): IDemoConfig {
    return this.configService.getConfig();
  }

  @Put()
  updateConfig(@Body() updates: Partial<IDemoConfig>): IDemoConfig {
    return this.configService.updateConfig(updates);
  }
}
