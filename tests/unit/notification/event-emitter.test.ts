/**
 * ValidationEventEmitter Tests
 */

import { ValidationEventEmitter, createEventEmitter } from '@notification/event-emitter';
import { describe, expect, it, vi } from 'vitest';

describe('ValidationEventEmitter', () => {
  it('should call listener when event is emitted', () => {
    const emitter = new ValidationEventEmitter();
    const listener = vi.fn();
    emitter.on('validation:start', listener);
    emitter.emit('validation:start', { field: 'x' });
    expect(listener).toHaveBeenCalledWith({ field: 'x' });
  });

  it('should support multiple listeners for same event', () => {
    const emitter = new ValidationEventEmitter();
    const a = vi.fn();
    const b = vi.fn();
    emitter.on('validation:end', a);
    emitter.on('validation:end', b);
    emitter.emit('validation:end', 'data');
    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
  });

  it('should not call listeners for other events', () => {
    const emitter = new ValidationEventEmitter();
    const listener = vi.fn();
    emitter.on('validation:start', listener);
    emitter.emit('validation:end', {});
    expect(listener).not.toHaveBeenCalled();
  });

  it('should return unsubscribe function that removes the listener', () => {
    const emitter = new ValidationEventEmitter();
    const listener = vi.fn();
    const unsub = emitter.on('validation:start', listener);
    unsub();
    emitter.emit('validation:start', {});
    expect(listener).not.toHaveBeenCalled();
  });

  it('should do nothing when emitting event with no listeners', () => {
    const emitter = new ValidationEventEmitter();
    expect(() => emitter.emit('validation:start', {})).not.toThrow();
  });

  it('should remove all listeners for an event with off()', () => {
    const emitter = new ValidationEventEmitter();
    const listener = vi.fn();
    emitter.on('validation:error', listener);
    emitter.off('validation:error');
    emitter.emit('validation:error', {});
    expect(listener).not.toHaveBeenCalled();
  });

  it('should remove all listeners with clear()', () => {
    const emitter = new ValidationEventEmitter();
    const a = vi.fn();
    const b = vi.fn();
    emitter.on('validation:start', a);
    emitter.on('validation:end', b);
    emitter.clear();
    emitter.emit('validation:start', {});
    emitter.emit('validation:end', {});
    expect(a).not.toHaveBeenCalled();
    expect(b).not.toHaveBeenCalled();
  });
});

describe('createEventEmitter', () => {
  it('should return a ValidationEventEmitter instance', () => {
    const emitter = createEventEmitter();
    expect(emitter).toBeInstanceOf(ValidationEventEmitter);
  });

  it('should be functional', () => {
    const emitter = createEventEmitter();
    const listener = vi.fn();
    emitter.on('validation:start', listener);
    emitter.emit('validation:start', 'test');
    expect(listener).toHaveBeenCalledWith('test');
  });
});
