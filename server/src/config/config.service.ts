import { Injectable } from '@nestjs/common';
import { DemoConfig, DEFAULT_DEMO_CONFIG } from '@blog/shared';

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
