import { Controller, Get, Put, Body } from '@nestjs/common';
import { ConfigService } from './config.service';
import type { DemoConfig } from '@blog/shared';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getConfig(): DemoConfig {
    return this.configService.getConfig();
  }

  @Put()
  updateConfig(@Body() updates: Partial<DemoConfig>): DemoConfig {
    return this.configService.updateConfig(updates);
  }
}
