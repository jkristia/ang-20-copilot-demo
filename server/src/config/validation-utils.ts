/**
 * Shared validation utilities for config classes
 */

/**
 * Clamps a number value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Clamps and rounds a number value between min and max
 */
export function clampInt(value: number, min: number, max: number): number {
  return Math.round(clamp(value, min, max));
}

/**
 * Truncates a string to a maximum length
 */
export function truncateString(value: string, maxLength: number): string {
  return value.slice(0, maxLength);
}
