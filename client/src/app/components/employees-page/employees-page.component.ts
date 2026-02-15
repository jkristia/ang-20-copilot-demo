import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { APP_ROUTES } from '../../app.routes.constants';

@Component({
  selector: 'app-employees-page',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './employees-page.component.html',
  styleUrl: './employees-page.component.scss',
})
export class EmployeesPageComponent {
  private readonly router = inject(Router);

  public readonly tabs = [
    { label: 'Employees', route: './', exact: true },
    { label: 'Details', route: './details', exact: false },
  ];

  public goBack(): void {
    this.router.navigate([APP_ROUTES.POSTS]);
  }
}
