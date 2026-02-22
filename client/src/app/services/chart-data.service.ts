import { Injectable } from '@angular/core';

/**
 * Mock chart data interface
 */
export interface BarChartDataItem {
  name: string;
  value: number;
}

/**
 * Service providing mock chart data.
 * Later this will be replaced with actual ChartService fetching data from backend.
 */
@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  /**
   * Returns mock bar chart data with 10 meaningful data points
   * representing monthly sales figures (in thousands)
   */
  getBarChartData(): BarChartDataItem[] {
    return [
      { name: 'January', value: 65 },
      { name: 'February', value: 59 },
      { name: 'March', value: 80 },
      { name: 'April', value: 81 },
      { name: 'May', value: 56 },
      { name: 'June', value: 55 },
      { name: 'July', value: 72 },
      { name: 'August', value: 90 },
      { name: 'September', value: 85 },
      { name: 'October', value: 78 },
    ];
  }
}
