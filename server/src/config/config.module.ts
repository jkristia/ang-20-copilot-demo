import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { RunningStateService } from './running-state.service';

@Module({
  controllers: [ConfigController],
  providers: [ConfigService, RunningStateService],
  exports: [ConfigService, RunningStateService],
})
export class ConfigModule {}
