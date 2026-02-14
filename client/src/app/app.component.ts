import { Component } from '@angular/core';
import { PostsListComponent } from './components/posts-list/posts-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PostsListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Blog Posts';
}
