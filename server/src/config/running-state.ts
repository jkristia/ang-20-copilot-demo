import {
  IRunningState,
  RunningStateEnum,
  RunningStateValidation,
} from '../../../shared/src/model.interfaces';

/**
 * RunningState class with validation and timer management
 * Server-side implementation
 */
export class RunningState implements IRunningState {
  private _state: RunningStateEnum = RunningStateEnum.IDLE;
  private _run_duration: number = RunningStateValidation.DURATION_DEFAULT;
  private _elapsed_seconds: number = 0;
  private _timer: NodeJS.Timeout | null = null;
  private _onUpdate: ((state: IRunningState) => void) | null = null;

  get state(): RunningStateEnum {
    return this._state;
  }

  get run_duration(): number {
    return this._run_duration;
  }

  set run_duration(value: number) {
    if (this._state === RunningStateEnum.IDLE) {
      this._run_duration = this.clamp(
        Math.round(value),
        RunningStateValidation.DURATION_MIN,
        RunningStateValidation.DURATION_MAX
      );
    }
  }

  get elapsed_seconds(): number {
    return this._elapsed_seconds;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Set callback for state updates
   */
  setUpdateCallback(callback: (state: IRunningState) => void): void {
    this._onUpdate = callback;
  }

  /**
   * Start running for the configured duration
   */
  start(): void {
    if (this._state === RunningStateEnum.RUNNING) {
      return;
    }

    this._state = RunningStateEnum.RUNNING;
    this._elapsed_seconds = 0;
    this.notifyUpdate();

    this._timer = setInterval(() => {
      this._elapsed_seconds++;
      this.notifyUpdate();

      if (this._elapsed_seconds >= this._run_duration) {
        this.stop();
      }
    }, 1000);
  }

  /**
   * Stop running and return to idle
   */
  private stop(): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    this._state = RunningStateEnum.IDLE;
    this._elapsed_seconds = 0;
    this.notifyUpdate();
  }

  private notifyUpdate(): void {
    if (this._onUpdate) {
      this._onUpdate(this.toJSON());
    }
  }

  /**
   * Converts to plain object (IRunningState)
   */
  toJSON(): IRunningState {
    return {
      state: this._state,
      run_duration: this._run_duration,
      elapsed_seconds: this._elapsed_seconds,
    };
  }
}
