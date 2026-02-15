import { Component, inject, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RunningStateService } from '../../services/running-state.service';
import {
  RunningStateEnum,
  RunningStateDescriptions,
  RunningStateValidation,
} from '../../models';

@Component({
  selector: 'app-running-state',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './running-state.component.html',
  styleUrl: './running-state.component.scss',
})
export class RunningStateComponent implements OnInit {
  private runningStateService = inject(RunningStateService);

  state = this.runningStateService.state;
  isIdle = computed(() => this.state().state === RunningStateEnum.IDLE);
  stateDescription = computed(() => RunningStateDescriptions[this.state().state]);
  elapsedSeconds = computed(() => this.state().elapsed_seconds);
  runDuration = computed(() => this.state().run_duration);

  validation = RunningStateValidation;

  ngOnInit(): void {
    this.runningStateService.getState();
  }

  onDurationChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value)) {
      this.runningStateService.setDuration(value);
    }
  }

  onRun(): void {
    this.runningStateService.start();
  }
}
