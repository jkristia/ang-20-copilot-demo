import { Routes } from '@angular/router';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { DemoConfigPageComponent } from './components/demo-config-page/demo-config-page.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { APP_ROUTES } from './app.routes.constants';

export const routes: Routes = [
  { path: APP_ROUTES.POSTS, component: PostsListComponent, pathMatch: 'full' },
  { path: APP_ROUTES.CONFIG, component: DemoConfigPageComponent },
  { path: APP_ROUTES.EMPLOYEES, component: EmployeesComponent },
  { path: '**', redirectTo: APP_ROUTES.POSTS },
];
