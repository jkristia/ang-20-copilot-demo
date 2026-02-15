import { Routes } from '@angular/router';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { DemoConfigPageComponent } from './components/demo-config-page/demo-config-page.component';
import { EmployeesPageComponent } from './components/employees-page/employees-page.component';
import { EmployeesListComponent } from './components/employees/employees.component';
import { EmployeeDetailsListComponent } from './components/employee-details-list/employee-details-list.component';
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
  { path: '**', redirectTo: APP_ROUTES.POSTS },
];
