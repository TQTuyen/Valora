/**
 * SimpleObserver Tests
 */

import { SimpleObserver } from '@core/observer/simple-observer';
import { describe, expect, it, vi } from 'vitest';

function makeEvent(type: 'start' | 'end' | 'error') {
  return { type, field: 'x', result: { success: true, errors: [], data: undefined } };
}

describe('SimpleObserver', () => {
  it('should call onStart callback on validation start', () => {
    const onStart = vi.fn();
    const obs = new SimpleObserver({ onStart });
    obs.onValidationStart(makeEvent('start'));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('should call onEnd callback on validation end', () => {
    const onEnd = vi.fn();
    const obs = new SimpleObserver({ onEnd });
    obs.onValidationEnd(makeEvent('end'));
    expect(onEnd).toHaveBeenCalledOnce();
  });

  it('should call onError callback on validation error', () => {
    const onError = vi.fn();
    const obs = new SimpleObserver({ onError });
    obs.onValidationError(makeEvent('error'));
    expect(onError).toHaveBeenCalledOnce();
  });

  it('should not throw when callbacks are not provided', () => {
    const obs = new SimpleObserver({});
    expect(() => obs.onValidationStart(makeEvent('start'))).not.toThrow();
    expect(() => obs.onValidationEnd(makeEvent('end'))).not.toThrow();
    expect(() => obs.onValidationError(makeEvent('error'))).not.toThrow();
  });
});
