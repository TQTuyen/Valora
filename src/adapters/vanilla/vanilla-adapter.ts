/**
 * Vanilla JavaScript Adapter
 * @module adapters/vanilla/vanilla-adapter
 */

import { BaseFrameworkAdapter } from '../base-adapter';

import { bindForm } from './dom-binder';

import type { FormBindingOptions } from './types';

/**
 * Vanilla JavaScript adapter for progressive enhancement
 *
 * Provides form validation with DOM integration for standard HTML forms.
 * Extends BaseFrameworkAdapter to add bidirectional DOM binding capabilities.
 *
 * @template T - The form data type
 *
 * @example
 * ```typescript
 * const adapter = new VanillaAdapter({
 *   email: string().email(),
 *   password: string().minLength(8),
 * });
 *
 * const cleanup = adapter.bindForm({
 *   form: document.getElementById('myForm'),
 *   onSubmit: async (values) => {
 *     await fetch('/api/submit', {
 *       method: 'POST',
 *       body: JSON.stringify(values),
 *     });
 *   },
 * });
 *
 * // Cleanup when done
 * cleanup();
 * ```
 */
export class VanillaAdapter<T extends Record<string, unknown>> extends BaseFrameworkAdapter<T> {
  private formCleanups: Array<() => void> = [];

  /**
   * Bind form element for bidirectional synchronization
   *
   * @param options - Form binding configuration
   * @returns Cleanup function to unbind form
   */
  bindForm(options: FormBindingOptions): () => void {
    const cleanup = bindForm<T>(this, options);
    this.formCleanups.push(cleanup);

    // Return cleanup that also removes from tracking
    return () => {
      cleanup();
      const index = this.formCleanups.indexOf(cleanup);
      if (index > -1) {
        this.formCleanups.splice(index, 1);
      }
    };
  }

  /**
   * Cleanup adapter and all form bindings
   */
  override destroy(): void {
    // Cleanup all form bindings
    this.formCleanups.forEach((cleanup) => {
      cleanup();
    });
    this.formCleanups = [];

    // Call parent cleanup (subscriptions)
    super.destroy();
  }
}
