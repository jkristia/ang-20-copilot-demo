import { Injectable } from '@nestjs/common';
import { DemoConfig, DEFAULT_DEMO_CONFIG } from '../../../shared/src/model.interfaces';

@Injectable()
export class ConfigService {
  private config: DemoConfig = { ...DEFAULT_DEMO_CONFIG };

  getConfig(): DemoConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<DemoConfig>): DemoConfig {
    this.config = {
      ...this.config,
      ...updates,
    };
    return { ...this.config };
  }
}
