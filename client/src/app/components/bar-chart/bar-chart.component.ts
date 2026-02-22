import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BaseChartDirective } from 'ng2-charts';
import { PlotlyModule } from 'angular-plotly.js';
import { NgxBarChartComponent } from './ngx-bar-chart.component';
import { Ng2BarChartComponent } from './ng2-bar-chart.component';
import { PlotlyBarChartComponent } from './plotly-bar-chart.component';
import { ChartDataService, BarChartDataItem } from '../../services/chart-data.service';
import { APP_ROUTES } from '../../app.routes.constants';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    NgxChartsModule,
    PlotlyModule,
    NgxBarChartComponent,
    Ng2BarChartComponent,
    PlotlyBarChartComponent,
  ],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent implements OnInit {
  private readonly chartDataService = inject(ChartDataService);
  private readonly router = inject(Router);

  // Mock data from shared service
  barChartData: BarChartDataItem[] = [];

  // ngx-charts configuration
  ngxChartView: [number, number] = [600, 300];
  ngxColorScheme = 'vivid';
  ngxShowXAxis = true;
  ngxShowYAxis = true;
  ngxShowXAxisLabel = true;
  ngxShowYAxisLabel = true;
  ngxXAxisLabel = 'Month';
  ngxYAxisLabel = 'Sales (thousands)';

  // ng2-charts configuration
  ng2ChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  ng2ChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Monthly Sales - ng2-charts' }
    },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { title: { display: true, text: 'Sales (thousands)' } }
    }
  };

  // Plotly configuration (using any to avoid strict typing issues)
  plotlyData: any[] = [];
  plotlyConfig: any = { staticPlot: false };
  plotlyLayout: any = {
    title: 'Monthly Sales - Plotly',
    xaxis: { title: 'Month' },
    yaxis: { title: 'Sales (thousands)' },
    height: 350,
    margin: { t: 50, b: 50, l: 60, r: 30 },
    transition: { duration: 0 }
  };

  ngOnInit(): void {
    this.barChartData = this.chartDataService.getBarChartData();
    this.setupNg2ChartData();
    this.setupPlotlyData();
  }

  private setupNg2ChartData(): void {
    this.ng2ChartData = {
      labels: this.barChartData.map(d => d.name),
      datasets: [
        {
          data: this.barChartData.map(d => d.value),
          label: 'Sales',
          backgroundColor: '#3f51b5',
          borderColor: '#303f9f',
          borderWidth: 1
        }
      ]
    };
  }

  private setupPlotlyData(): void {
    this.plotlyData = [
      {
        x: this.barChartData.map(d => d.name),
        y: this.barChartData.map(d => d.value),
        type: 'bar',
        marker: { color: '#3f51b5' }
      }
    ];
  }

  navigateBack(): void {
    this.router.navigate([APP_ROUTES.POSTS]);
  }
}
