/**
 * Observer Pattern - Simple Observer Implementation
 * @module core/observer
 */

import type { IValidationObserver, ValidationEvent } from '#types/index';

/**
 * Simple observer implementation
 */
export class SimpleObserver<T = unknown> implements IValidationObserver<T> {
  constructor(
    private readonly callbacks: {
      onStart?: (event: ValidationEvent<T>) => void;
      onEnd?: (event: ValidationEvent<T>) => void;
      onError?: (event: ValidationEvent<T>) => void;
    },
  ) {}

  onValidationStart(event: ValidationEvent<T>): void {
    this.callbacks.onStart?.(event);
  }

  onValidationEnd(event: ValidationEvent<T>): void {
    this.callbacks.onEnd?.(event);
  }

  onValidationError(event: ValidationEvent<T>): void {
    this.callbacks.onError?.(event);
  }
}
