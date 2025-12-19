/**
 * Validation Event Emitter
 * Alternative Observer implementation using event emitter pattern
 * @module notification/event-emitter
 */

import type { EventListener, Unsubscribe, ValidationEventType } from './types';

/**
 * Simple event emitter for validation events
 */
export class ValidationEventEmitter {
  private listeners: Map<ValidationEventType, Set<EventListener>> = new Map();

  /** Subscribe to an event */
  on<T>(event: ValidationEventType, listener: EventListener<T>): Unsubscribe {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)?.add(listener as EventListener);

    return () => {
      this.listeners.get(event)?.delete(listener as EventListener);
    };
  }

  /** Emit an event */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  emit<T>(event: ValidationEventType, data: T): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      for (const listener of eventListeners) {
        listener(data);
      }
    }
  }

  /** Remove all listeners for an event */
  off(event: ValidationEventType): void {
    this.listeners.delete(event);
  }

  /** Remove all listeners */
  clear(): void {
    this.listeners.clear();
  }
}

/**
 * Create a validation event emitter
 */
export function createEventEmitter(): ValidationEventEmitter {
  return new ValidationEventEmitter();
}
