# Client

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.20.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## Bar Chart Demo

The application includes a bar chart demo page accessible at `#/bar-chart` that displays the same mock data using three different chart libraries:

- **ngx-charts** (`@swimlane/ngx-charts`)
- **ng2-charts** (Chart.js wrapper for Angular)
- **Plotly** (`angular-plotly.js`)

### Layout
- Charts are displayed in individual components: `NgxBarChartComponent`, `Ng2BarChartComponent`, `PlotlyBarChartComponent`.
- Responsive layout: two charts on the first row, one on the second (with wrapping).
- Each chart card has a max width (700px) and charts are sized to fit without overflow or horizontal scroll.

### Data
- Mock data is provided via `ChartDataService`.
- Data represents monthly sales figures for 10 months.

### Navigation
- Access the demo via the toolbar button or `#/bar-chart` route.

### Customization
- Animations are disabled for all charts.
- Chart cards and charts are responsive and will not overflow.

### Chart Dependencies
- `@swimlane/ngx-charts`
- `ng2-charts` and `chart.js`
- `angular-plotly.js` and `plotly.js-dist-min`
