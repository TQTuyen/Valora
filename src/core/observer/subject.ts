/**
 * Observer Pattern - Validation Subject
 * @module core/observer
 */

import type { IValidationObserver, IValidationSubject, ValidationEvent } from '#types/index';

/**
 * Validation subject for the Observer Pattern
 */
export class ValidationSubject<T = unknown> implements IValidationSubject<T> {
  private observers: Set<IValidationObserver<T>> = new Set();

  addObserver(observer: IValidationObserver<T>): void {
    this.observers.add(observer);
  }

  removeObserver(observer: IValidationObserver<T>): void {
    this.observers.delete(observer);
  }

  notifyObservers(event: ValidationEvent<T>): void {
    for (const observer of this.observers) {
      try {
        switch (event.type) {
          case 'start':
            observer.onValidationStart?.(event);
            break;
          case 'end':
            observer.onValidationEnd?.(event);
            break;
          case 'error':
            observer.onValidationError?.(event);
            break;
        }
      } catch (error) {
        console.error('[Valora] Observer error:', error);
      }
    }
  }

  get observerCount(): number {
    return this.observers.size;
  }

  clearObservers(): void {
    this.observers.clear();
  }
}
