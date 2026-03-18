/**
 * Object Validator — extend strategy and object().extend() coverage
 */

import { ExtendStrategy } from '@validators/object/strategies/extend';
import { object } from '@validators/object';
import { string } from '@validators/string';
import { number } from '@validators/number';
import { describe, expect, it } from 'vitest';

import { createContext } from '../../helpers/test-utils';

describe('ExtendStrategy (direct)', () => {
  const ctx = createContext({ path: [], field: '' });

  it('should extend object with extra fields on success', () => {
    const strategy = new ExtendStrategy({ age: number() });
    const result = strategy.validate({ name: 'Alice', age: 30 }, ctx);
    expect(result.success).toBe(true);
    // age should be present in output
    expect((result.data as Record<string, unknown>).age).toBe(30);
  });

  it('should fail when extension field is invalid', () => {
    const strategy = new ExtendStrategy({ age: number().min(18) });
    const result = strategy.validate({ name: 'Alice', age: 10 }, ctx);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should preserve existing fields in result', () => {
    const strategy = new ExtendStrategy({ extra: string() });
    const result = strategy.validate({ name: 'Bob', extra: 'hello' }, ctx);
    expect(result.success).toBe(true);
    expect((result.data as Record<string, unknown>).name).toBe('Bob');
  });

  it('should collect errors from multiple failing extension fields', () => {
    const strategy = new ExtendStrategy({ a: string().email(), b: number().min(100) });
    const result = strategy.validate({ a: 'bad', b: 1 }, ctx);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  it('should validate successfully when extension field is missing but optional', () => {
    const strategy = new ExtendStrategy({ age: number().optional() });
    const result = strategy.validate({ name: 'Alice' }, ctx);
    expect(result.success).toBe(true);
  });
});

describe('ObjectValidator extend() method', () => {
  const ctx = createContext();

  it('should extend base schema with new fields', () => {
    const base = object({ name: string() });
    const extended = base.extend({ age: number() });

    const valid = extended.validate({ name: 'Alice', age: 30 }, ctx);
    expect(valid.success).toBe(true);
    expect(valid.data).toMatchObject({ name: 'Alice', age: 30 });
  });

  it('should fail when extension field is invalid', () => {
    const extended = object({ name: string() }).extend({ age: number().min(0) });
    const result = extended.validate({ name: 'Alice', age: -1 }, ctx);
    expect(result.success).toBe(false);
  });

  it('should merge() with another object validator', () => {
    const a = object({ name: string() });
    const b = object({ age: number() });
    const merged = a.merge(b);
    expect(merged.validate({ name: 'Bob', age: 20 }, ctx).success).toBe(true);
  });
});
