import { Routes } from '@angular/router';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { DemoConfigComponent } from './components/demo-config/demo-config.component';
import { APP_ROUTES } from './app.routes.constants';

export const routes: Routes = [
  { path: APP_ROUTES.POSTS, component: PostsListComponent, pathMatch: 'full' },
  { path: APP_ROUTES.CONFIG, component: DemoConfigComponent },
  { path: '**', redirectTo: APP_ROUTES.POSTS },
];
