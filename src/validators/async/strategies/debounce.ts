/**
 * Debounce Strategy
 * @module validators/async/strategies/debounce
 */

import { BaseAsyncValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Debounce strategy
 *
 * Delays validation execution until after a specified delay has passed
 * since the last call. Useful for real-time validation (e.g., username availability).
 */
export class DebounceStrategy<T = unknown> extends BaseAsyncValidationStrategy<T, T> {
  readonly name = 'debounce';

  private timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
  private pendingResolve: ((value: ValidationResult<T>) => void) | undefined = undefined;

  constructor(readonly debounceMs: number) {
    super();
  }

  async validate(value: T, context: ValidationContext): Promise<ValidationResult<T>> {
    // Clear existing timeout
    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
    }

    // Create new promise that resolves after delay
    return new Promise((resolve) => {
      // Store resolve function in case we need to cancel
      this.pendingResolve = resolve;

      this.timeoutId = setTimeout(() => {
        resolve(this.success(value, context));
        this.timeoutId = undefined;
        this.pendingResolve = undefined;
      }, this.debounceMs);
    });
  }

  /**
   * Cancel pending debounced validation
   */
  cancel(): void {
    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    if (this.pendingResolve !== undefined) {
      // Resolve immediately with failure
      const context: ValidationContext = {
        path: [],
        field: '',
        locale: 'en',
      };
      this.pendingResolve(this.failure('Debounced validation cancelled', context));
      this.pendingResolve = undefined;
    }
  }
}
