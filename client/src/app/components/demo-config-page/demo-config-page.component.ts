import { Component } from '@angular/core';
import { RunningStateComponent } from '../running-state/running-state.component';
import { DemoConfigComponent } from '../demo-config/demo-config.component';

@Component({
  selector: 'app-demo-config-page',
  standalone: true,
  imports: [RunningStateComponent, DemoConfigComponent],
  templateUrl: './demo-config-page.component.html',
  styleUrl: './demo-config-page.component.scss',
})
export class DemoConfigPageComponent {}
