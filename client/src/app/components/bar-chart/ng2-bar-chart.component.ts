import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-ng2-bar-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="chart-wrapper">
      <canvas baseChart
        [data]="data"
        [options]="options"
        type="bar">
      </canvas>
    </div>
  `,
  styleUrls: ['./ng2-bar-chart.component.scss']
})
export class Ng2BarChartComponent {
  @Input() data: any;
  @Input() options: any;
}
