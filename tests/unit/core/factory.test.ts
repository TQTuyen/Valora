/**
 * ValidatorFactory Tests
 */

import { ValidatorFactory } from '@core/factory/validator-factory';
import { string } from '@validators/string';
import { describe, expect, it, beforeEach } from 'vitest';

describe('ValidatorFactory', () => {
  beforeEach(() => {
    ValidatorFactory.resetInstance();
  });

  it('should return the same singleton instance', () => {
    const a = ValidatorFactory.getInstance();
    const b = ValidatorFactory.getInstance();
    expect(a).toBe(b);
  });

  it('should create a new instance after resetInstance', () => {
    const a = ValidatorFactory.getInstance();
    ValidatorFactory.resetInstance();
    const b = ValidatorFactory.getInstance();
    expect(a).not.toBe(b);
  });

  it('should register a validator', () => {
    const factory = ValidatorFactory.getInstance();
    factory.register({ name: 'myString', factory: () => string() });
    expect(factory.has('myString')).toBe(true);
  });

  it('should throw when registering duplicate name', () => {
    const factory = ValidatorFactory.getInstance();
    factory.register({ name: 'dup', factory: () => string() });
    expect(() => factory.register({ name: 'dup', factory: () => string() })).toThrow(
      '[Valora] Validator "dup" is already registered',
    );
  });

  it('create() should return validator instance', () => {
    const factory = ValidatorFactory.getInstance();
    factory.register({ name: 'myStr', factory: () => string() });
    const v = factory.create('myStr');
    expect(v).toBeDefined();
  });

  it('create() should return undefined for unknown validator', () => {
    const factory = ValidatorFactory.getInstance();
    const v = factory.create('nonexistent');
    expect(v).toBeUndefined();
  });

  it('has() should return false for unknown validator', () => {
    const factory = ValidatorFactory.getInstance();
    expect(factory.has('nope')).toBe(false);
  });

  it('getAll() should return all registrations', () => {
    const factory = ValidatorFactory.getInstance();
    factory.register({ name: 'a', factory: () => string() });
    factory.register({ name: 'b', factory: () => string() });
    const all = factory.getAll();
    expect(all.length).toBe(2);
    expect(all.map((r) => r.name)).toContain('a');
    expect(all.map((r) => r.name)).toContain('b');
  });

  it('clear() should remove all registrations', () => {
    const factory = ValidatorFactory.getInstance();
    factory.register({ name: 'x', factory: () => string() });
    factory.clear();
    expect(factory.has('x')).toBe(false);
    expect(factory.getAll()).toEqual([]);
  });
});
