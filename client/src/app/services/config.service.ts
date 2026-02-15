import { Injectable, inject, DestroyRef, signal } from '@angular/core';
import { IDemoConfig, DEFAULT_DEMO_CONFIG } from '../models';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private websocketService = inject(WebSocketService);
  private destroyRef = inject(DestroyRef);

  config = signal<IDemoConfig>(DEFAULT_DEMO_CONFIG);

  constructor() {
    const currentSub = this.websocketService.onConfigCurrent().subscribe((config) => {
      this.config.set(config);
    });

    const updatedSub = this.websocketService.onConfigUpdated().subscribe((config) => {
      this.config.set(config);
    });

    this.destroyRef.onDestroy(() => {
      currentSub.unsubscribe();
      updatedSub.unsubscribe();
    });
  }

  getConfig(): void {
    this.websocketService.getConfig();
  }

  updateConfig(updates: Partial<IDemoConfig>): void {
    this.websocketService.updateConfig(updates);
  }
}
