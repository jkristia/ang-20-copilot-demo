import { Routes } from '@angular/router';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { DemoConfigPageComponent } from './components/demo-config-page/demo-config-page.component';
import { EmployeesPageComponent } from './components/employees-page/employees-page.component';
import { EmployeesListComponent } from './components/employees/employees.component';
import { EmployeeDetailsListComponent } from './components/employee-details-list/employee-details-list.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { NetworkDevicePageComponent } from './components/network-device-page/network-device-page.component';
import { DataGrid2Component } from './components/datagrid-2/datagrid-2.component';
import { APP_ROUTES } from './app.routes.constants';

export const routes: Routes = [
  { path: APP_ROUTES.POSTS, component: PostsListComponent, pathMatch: 'full' },
  { path: APP_ROUTES.CONFIG, component: DemoConfigPageComponent },
  {
    path: APP_ROUTES.EMPLOYEES,
    component: EmployeesPageComponent,
    children: [
      { path: '', component: EmployeesListComponent },
      { path: 'details', component: EmployeeDetailsListComponent },
    ],
  },
  { path: APP_ROUTES.BAR_CHART, component: BarChartComponent },
  { path: APP_ROUTES.NETWORK_DEVICE, component: NetworkDevicePageComponent },
  { path: APP_ROUTES.DATAGRID_2, component: DataGrid2Component },
  { path: '**', redirectTo: APP_ROUTES.POSTS },
];
