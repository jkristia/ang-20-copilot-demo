import { Injectable, inject, DestroyRef, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDemoConfig, DEFAULT_DEMO_CONFIG } from '../models';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private websocketService = inject(WebSocketService);
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private readonly apiUrl = 'http://localhost:3000/api/config';

  config = signal<IDemoConfig>(DEFAULT_DEMO_CONFIG);

  constructor() {
    const updatedSub = this.websocketService.onConfigUpdated().subscribe((config) => {
      this.config.set(config);
    });

    this.destroyRef.onDestroy(() => {
      updatedSub.unsubscribe();
    });
  }

  getConfig(): void {
    this.http.get<IDemoConfig>(this.apiUrl).subscribe((config) => {
      this.config.set(config);
    });
  }

  updateConfig(updates: Partial<IDemoConfig>): void {
    this.http.put<IDemoConfig>(this.apiUrl, updates).subscribe((config) => {
      this.config.set(config);
    });
  }
}
