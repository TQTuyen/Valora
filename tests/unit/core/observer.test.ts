/**
 * ValidationSubject (Observer Pattern) Tests
 */

import { ValidationSubject } from '@core/observer/subject';
import { describe, expect, it, vi } from 'vitest';

import type { IValidationObserver, ValidationEvent } from '#types/index';

function makeEvent(type: 'start' | 'end' | 'error'): ValidationEvent {
  return {
    type,
    field: 'email',
    value: undefined,
    timestamp: Date.now(),
    result: { success: true, errors: [], data: undefined },
  };
}

describe('ValidationSubject', () => {
  it('should start with 0 observers', () => {
    const subject = new ValidationSubject();
    expect(subject.observerCount).toBe(0);
  });

  it('should add and count observers', () => {
    const subject = new ValidationSubject();
    const obs: IValidationObserver = { onValidationStart: vi.fn() };
    subject.addObserver(obs);
    expect(subject.observerCount).toBe(1);
  });

  it('should remove observers', () => {
    const subject = new ValidationSubject();
    const obs: IValidationObserver = { onValidationStart: vi.fn() };
    subject.addObserver(obs);
    subject.removeObserver(obs);
    expect(subject.observerCount).toBe(0);
  });

  it('should notify onValidationStart for start events', () => {
    const subject = new ValidationSubject();
    const onStart = vi.fn();
    subject.addObserver({ onValidationStart: onStart });
    subject.notifyObservers(makeEvent('start'));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('should notify onValidationEnd for end events', () => {
    const subject = new ValidationSubject();
    const onEnd = vi.fn();
    subject.addObserver({ onValidationEnd: onEnd });
    subject.notifyObservers(makeEvent('end'));
    expect(onEnd).toHaveBeenCalledOnce();
  });

  it('should notify onValidationError for error events', () => {
    const subject = new ValidationSubject();
    const onError = vi.fn();
    subject.addObserver({ onValidationError: onError });
    subject.notifyObservers(makeEvent('error'));
    expect(onError).toHaveBeenCalledOnce();
  });

  it('should not throw if observer method is missing', () => {
    const subject = new ValidationSubject();
    // Observer with no methods
    subject.addObserver({});
    expect(() => subject.notifyObservers(makeEvent('start'))).not.toThrow();
    expect(() => subject.notifyObservers(makeEvent('end'))).not.toThrow();
    expect(() => subject.notifyObservers(makeEvent('error'))).not.toThrow();
  });

  it('should catch errors thrown by observer and not propagate', () => {
    const subject = new ValidationSubject();
    const throwing: IValidationObserver = {
      onValidationStart: () => { throw new Error('observer error'); },
    };
    subject.addObserver(throwing);
    expect(() => subject.notifyObservers(makeEvent('start'))).not.toThrow();
  });

  it('should notify all observers', () => {
    const subject = new ValidationSubject();
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    subject.addObserver({ onValidationStart: fn1 });
    subject.addObserver({ onValidationStart: fn2 });
    subject.notifyObservers(makeEvent('start'));
    expect(fn1).toHaveBeenCalledOnce();
    expect(fn2).toHaveBeenCalledOnce();
  });

  it('clearObservers should remove all observers', () => {
    const subject = new ValidationSubject();
    subject.addObserver({ onValidationStart: vi.fn() });
    subject.addObserver({ onValidationEnd: vi.fn() });
    subject.clearObservers();
    expect(subject.observerCount).toBe(0);
  });
});
