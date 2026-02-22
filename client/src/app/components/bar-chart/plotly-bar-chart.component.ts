import { Component, Input } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';

@Component({
  selector: 'app-plotly-bar-chart',
  standalone: true,
  imports: [PlotlyModule],
  template: `
    <plotly-plot
      [data]="data"
      [layout]="layout"
      [config]="config"
      [useResizeHandler]="true"
      [style]="{ width: '100%', height: '350px' }">
    </plotly-plot>
  `
})
export class PlotlyBarChartComponent {
  @Input() data: any[] = [];
  @Input() layout: any;
  @Input() config: any;
}
