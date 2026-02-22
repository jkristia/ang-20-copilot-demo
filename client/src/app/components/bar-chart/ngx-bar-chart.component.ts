import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-ngx-bar-chart',
  standalone: true,
  imports: [NgxChartsModule],
  template: `
    <ngx-charts-bar-vertical
      [view]="view"
      [results]="data"
      [scheme]="colorScheme"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      [showXAxisLabel]="showXAxisLabel"
      [showYAxisLabel]="showYAxisLabel"
      [xAxisLabel]="xAxisLabel"
      [yAxisLabel]="yAxisLabel"
      [animations]="false">
    </ngx-charts-bar-vertical>
  `
})
export class NgxBarChartComponent {
  @Input() data: any[] = [];
  @Input() view: [number, number] = [600, 300];
  @Input() colorScheme = 'vivid';
  @Input() showXAxis = true;
  @Input() showYAxis = true;
  @Input() showXAxisLabel = true;
  @Input() showYAxisLabel = true;
  @Input() xAxisLabel = 'Month';
  @Input() yAxisLabel = 'Sales (thousands)';
}
