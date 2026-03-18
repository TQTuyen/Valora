/**
 * ValidationEventEmitter Tests
 */

import { ValidationEventEmitter, createEventEmitter } from '@notification/event-emitter';
import { describe, expect, it, vi } from 'vitest';

describe('ValidationEventEmitter', () => {
  it('should call listener when event is emitted', () => {
    const emitter = new ValidationEventEmitter();
    const listener = vi.fn();
    emitter.on('start', listener);
    emitter.emit('start', { field: 'x' });
    expect(listener).toHaveBeenCalledWith({ field: 'x' });
  });

  it('should support multiple listeners for same event', () => {
    const emitter = new ValidationEventEmitter();
    const a = vi.fn();
    const b = vi.fn();
    emitter.on('end', a);
    emitter.on('end', b);
    emitter.emit('end', 'data');
    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
  });

  it('should not call listeners for other events', () => {
    const emitter = new ValidationEventEmitter();
    const listener = vi.fn();
    emitter.on('start', listener);
    emitter.emit('end', {});
    expect(listener).not.toHaveBeenCalled();
  });

  it('should return unsubscribe function that removes the listener', () => {
    const emitter = new ValidationEventEmitter();
    const listener = vi.fn();
    const unsub = emitter.on('start', listener);
    unsub();
    emitter.emit('start', {});
    expect(listener).not.toHaveBeenCalled();
  });

  it('should do nothing when emitting event with no listeners', () => {
    const emitter = new ValidationEventEmitter();
    expect(() => emitter.emit('start', {})).not.toThrow();
  });

  it('should remove all listeners for an event with off()', () => {
    const emitter = new ValidationEventEmitter();
    const listener = vi.fn();
    emitter.on('error', listener);
    emitter.off('error');
    emitter.emit('error', {});
    expect(listener).not.toHaveBeenCalled();
  });

  it('should remove all listeners with clear()', () => {
    const emitter = new ValidationEventEmitter();
    const a = vi.fn();
    const b = vi.fn();
    emitter.on('start', a);
    emitter.on('end', b);
    emitter.clear();
    emitter.emit('start', {});
    emitter.emit('end', {});
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
    emitter.on('start', listener);
    emitter.emit('start', 'test');
    expect(listener).toHaveBeenCalledWith('test');
  });
});
