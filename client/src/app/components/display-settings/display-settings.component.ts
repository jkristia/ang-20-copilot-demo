import { Component, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfigService } from '../../services/config.service';
import { RunningStateService } from '../../services/running-state.service';
import {
  ThemeEnum,
  ThemeDescriptions,
  DisplaySettingsValidation,
} from '../../models';

@Component({
  selector: 'app-display-settings',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './display-settings.component.html',
  styleUrl: './display-settings.component.scss',
})
export class DisplaySettingsComponent {
  private configService = inject(ConfigService);
  private runningStateService = inject(RunningStateService);

  displaySettings = computed(() => this.configService.config().display_settings);
  isEnabled = computed(() => this.configService.config().enabled);
  isIdle = this.runningStateService.isIdle;
  isDisabled = computed(() => !this.isIdle() || !this.isEnabled());

  themeOptions = Object.values(ThemeEnum);
  themeDescriptions = ThemeDescriptions;
  validation = DisplaySettingsValidation;

  onDarkModeChange(enabled: boolean): void {
    this.configService.updateConfig({
      display_settings: { ...this.displaySettings(), dark_mode: enabled },
    });
  }

  onFontSizeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value)) {
      this.configService.updateConfig({
        display_settings: { ...this.displaySettings(), font_size: value },
      });
    }
  }

  onShowAnimationsChange(enabled: boolean): void {
    this.configService.updateConfig({
      display_settings: { ...this.displaySettings(), show_animations: enabled },
    });
  }

  onThemeChange(theme: ThemeEnum): void {
    this.configService.updateConfig({
      display_settings: { ...this.displaySettings(), theme },
    });
  }
}
