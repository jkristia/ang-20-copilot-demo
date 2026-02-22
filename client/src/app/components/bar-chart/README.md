# Bar Chart Demo Page

This page demonstrates three Angular bar chart libraries:
- **ngx-charts**
- **ng2-charts**
- **Plotly**

## Layout
- Charts are displayed in individual components: `NgxBarChartComponent`, `Ng2BarChartComponent`, `PlotlyBarChartComponent`.
- The layout is responsive: two charts on the first row, one on the second (with wrapping).
- Each chart card has a max width (700px) and charts are sized to fit without overflow or horizontal scroll.

## Data
- Mock data is provided via `ChartDataService`.
- Data represents monthly sales figures for 10 months.

## Navigation
- Access the demo via the toolbar button or `#/bar-chart` route.

## Customization
- Animations are disabled for all charts.
- Chart cards and charts are responsive and will not overflow.

## Dependencies
- `@swimlane/ngx-charts`
- `ng2-charts`, `chart.js`
- `angular-plotly.js`, `plotly.js-dist-min`

## Example Usage
```
<app-ngx-bar-chart [data]="barChartData" ... ></app-ngx-bar-chart>
<app-ng2-bar-chart [data]="ng2ChartData" [options]="ng2ChartOptions"></app-ng2-bar-chart>
<app-plotly-bar-chart [data]="plotlyData" [layout]="plotlyLayout" [config]="plotlyConfig"></app-plotly-bar-chart>
```

See main project README for more details.
