import { Injectable, OnModuleInit } from '@nestjs/common';
import { IDemoConfig } from '../../../shared/src/model.interfaces';
import { DemoConfig } from './demo.config';
import { PersistenceService } from '../persistence/persistence.service';

@Injectable()
export class ConfigService implements OnModuleInit {
  private config: DemoConfig = new DemoConfig();

  constructor(private readonly persistenceService: PersistenceService) {}

  public onModuleInit(): void {
    this.loadConfig();
  }

  private loadConfig(): void {
    const savedConfig = this.persistenceService.loadConfig<IDemoConfig>();
    if (savedConfig) {
      this.config = DemoConfig.fromJSON(savedConfig);
    }
  }

  private saveConfig(): void {
    this.persistenceService.saveConfig(this.config.toJSON());
  }

  public getConfig(): IDemoConfig {
    return this.config.toJSON();
  }

  public updateConfig(updates: Partial<IDemoConfig>): IDemoConfig {
    this.config.updateFrom(updates);
    this.saveConfig();
    return this.config.toJSON();
  }
}
