import { Injectable } from '@nestjs/common';
import { IDemoConfig } from '../../../shared/src/model.interfaces';
import { DemoConfig } from './demo.config';

@Injectable()
export class ConfigService {
  private config: DemoConfig = new DemoConfig();

  getConfig(): IDemoConfig {
    return this.config.toJSON();
  }

  updateConfig(updates: Partial<IDemoConfig>): IDemoConfig {
    this.config.updateFrom(updates);
    return this.config.toJSON();
  }
}
