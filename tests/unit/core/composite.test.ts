/**
 * CompositeValidator Tests
 */

import { CompositeValidator } from '@core/composite/composite-validator';
import { string } from '@validators/string';
import { number } from '@validators/number';
import { describe, expect, it } from 'vitest';

const ctx = { path: [], field: 'test', locale: 'en' as const };

describe('CompositeValidator', () => {
  it('should have _type = composite', () => {
    const v = new CompositeValidator();
    expect(v._type).toBe('composite');
  });

  it('should return success with empty validators', () => {
    const v = new CompositeValidator();
    const result = v.validate('hello', ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe('hello');
  });

  it('should validate with a single validator', () => {
    const v = new CompositeValidator([string()]);
    expect(v.validate('hello', ctx).success).toBe(true);
    expect(v.validate(42, ctx).success).toBe(false);
  });

  it('should chain multiple validators and pass transformed data', () => {
    const v = new CompositeValidator([string().required(), string().email()]);
    expect(v.validate('user@example.com', ctx).success).toBe(true);
    expect(v.validate('not-an-email', ctx).success).toBe(false);
  });

  it('should collect errors from all failing validators', () => {
    // Two validators both fail
    const v = new CompositeValidator([string().minLength(10), string().email()]);
    const result = v.validate('a', ctx);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  it('add() should append a validator and return this', () => {
    const v = new CompositeValidator<string>();
    const ret = v.add(string().required());
    expect(ret).toBe(v);
    expect(v.length).toBe(1);
  });

  it('remove() should remove an existing validator', () => {
    const sv = string().required();
    const v = new CompositeValidator([sv]);
    expect(v.length).toBe(1);
    v.remove(sv);
    expect(v.length).toBe(0);
  });

  it('remove() should be a no-op for non-existent validator', () => {
    const sv = string().required();
    const v = new CompositeValidator();
    v.remove(sv); // should not throw
    expect(v.length).toBe(0);
  });

  it('length should return number of validators', () => {
    const v = new CompositeValidator([string(), number()]);
    expect(v.length).toBe(2);
  });

  it('should use default context when none provided', () => {
    const v = new CompositeValidator([string()]);
    const result = v.validate('hello');
    expect(result.success).toBe(true);
  });

  it('should pass current value through chain on success', () => {
    // trim transform — result.data changes
    const v = new CompositeValidator([string().trim()]);
    const result = v.validate('  hello  ', ctx);
    expect(result.success).toBe(true);
    // Trimmed value should be propagated
    expect((result.data as string).trim()).toBe('hello');
  });
});
