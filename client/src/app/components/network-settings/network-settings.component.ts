import { Component, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfigService } from '../../services/config.service';
import { RunningStateService } from '../../services/running-state.service';
import {
  ConnectionModeEnum,
  ConnectionModeDescriptions,
  NetworkSettingsValidation,
} from '../../models';

@Component({
  selector: 'app-network-settings',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
  ],
  templateUrl: './network-settings.component.html',
  styleUrl: './network-settings.component.scss',
})
export class NetworkSettingsComponent {
  private configService = inject(ConfigService);
  private runningStateService = inject(RunningStateService);

  networkSettings = computed(() => this.configService.config().network_settings);
  isEnabled = computed(() => this.configService.config().enabled);
  isIdle = this.runningStateService.isIdle;
  isDisabled = computed(() => !this.isIdle() || !this.isEnabled());
  isRetryDisabled = computed(() => this.isDisabled() || !this.networkSettings().allow_retry);

  connectionModeOptions = Object.values(ConnectionModeEnum);
  connectionModeDescriptions = ConnectionModeDescriptions;
  validation = NetworkSettingsValidation;

  onNetworkEnabledChange(enabled: boolean): void {
    this.configService.updateConfig({
      network_settings: { ...this.networkSettings(), network_enabled: enabled },
    });
  }

  onTimeoutChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value)) {
      this.configService.updateConfig({
        network_settings: { ...this.networkSettings(), timeout_seconds: value },
      });
    }
  }

  onAllowRetryChange(checked: boolean): void {
    this.configService.updateConfig({
      network_settings: { ...this.networkSettings(), allow_retry: checked },
    });
  }

  onRetryCountChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value)) {
      this.configService.updateConfig({
        network_settings: { ...this.networkSettings(), retry_count: value },
      });
    }
  }

  onConnectionModeChange(mode: ConnectionModeEnum): void {
    this.configService.updateConfig({
      network_settings: { ...this.networkSettings(), connection_mode: mode },
    });
  }
}
