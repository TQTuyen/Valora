/**
 * Event Manager - Track and cleanup event listeners
 * @module adapters/vanilla/event-manager
 */

/**
 * Manages event listeners with automatic cleanup
 */
export class EventManager {
  private listeners: Array<{
    element: EventTarget;
    event: string;
    handler: EventListener;
    options: AddEventListenerOptions | undefined;
  }> = [];

  /**
   * Add event listener and track it for cleanup
   */
  addEventListener(
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions,
  ): void {
    element.addEventListener(event, handler, options);
    this.listeners.push({ element, event, handler, options });
  }

  /**
   * Add submit listener with optional preventDefault
   */
  addSubmitListener(
    form: HTMLFormElement,
    handler: (event: Event) => void | Promise<void>,
    preventDefault = true,
  ): void {
    const wrappedHandler: EventListener = (event: Event) => {
      if (preventDefault) {
        event.preventDefault();
      }
      void handler(event);
    };

    this.addEventListener(form, 'submit', wrappedHandler);
  }

  /**
   * Remove all tracked event listeners
   */
  cleanup(): void {
    this.listeners.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    this.listeners = [];
  }
}
