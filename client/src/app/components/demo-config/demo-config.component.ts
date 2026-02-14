import { Component, inject, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfigService } from '../../services/config.service';
import { APP_ROUTES } from '../../app.routes.constants';
import { SelectEnum, SelectEnumDescriptions } from '../../models';

@Component({
  selector: 'app-demo-config',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './demo-config.component.html',
  styleUrl: './demo-config.component.scss',
})
export class DemoConfigComponent implements OnInit {
  private configService = inject(ConfigService);
  private router = inject(Router);

  config = this.configService.config;
  isEnabled = computed(() => this.config().enabled);

  selectOptions = Object.values(SelectEnum);
  selectDescriptions = SelectEnumDescriptions;

  ngOnInit(): void {
    this.configService.getConfig();
  }

  onEnabledChange(enabled: boolean): void {
    this.configService.updateConfig({ enabled });
  }

  onFloatValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      this.configService.updateConfig({ float_value: value });
    }
  }

  onIntValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value)) {
      this.configService.updateConfig({ int_value: value });
    }
  }

  onStringValueChange(value: string): void {
    this.configService.updateConfig({ string_value: value });
  }

  onSelectValueChange(value: SelectEnum): void {
    this.configService.updateConfig({ select_value: value });
  }

  goBack(): void {
    this.router.navigate([APP_ROUTES.POSTS]);
  }
}
