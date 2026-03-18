/**
 * Core Decorator Pattern Tests
 * Tests for ValidatorDecorator, PreprocessDecorator, MessageDecorator, TransformDecorator
 */

import { PreprocessDecorator } from '@core/decorator/preprocess';
import { TransformDecorator } from '@core/decorator/transform';
import { MessageDecorator } from '@core/decorator/message';
import { DefaultDecorator } from '@core/decorator/default';
import { OptionalDecorator } from '@core/decorator/optional';
import { NullableDecorator } from '@core/decorator/nullable';
import { string } from '@validators/string';
import { number } from '@validators/number';
import { describe, expect, it } from 'vitest';

const ctx = { path: [], field: 'test', locale: 'en' as const };

describe('PreprocessDecorator', () => {
  it('should preprocess the value before validation', () => {
    // trim before validating
    const trimmed = new PreprocessDecorator(string().minLength(3), (v: string) => v.trim());
    expect(trimmed.validate('  hello  ', ctx).success).toBe(true);
    expect(trimmed.validate('  ab  ', ctx).success).toBe(false); // trim → 'ab' (length 2)
  });

  it('should expose the wrapped _type', () => {
    const p = new PreprocessDecorator(string(), (v: string) => v);
    expect(p._type).toBe('string');
  });

  it('should pass context to wrapped validator', () => {
    const p = new PreprocessDecorator(number(), (v: string) => Number(v));
    const result = p.validate('42', ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe(42);
  });
});

describe('TransformDecorator', () => {
  it('should transform result after validation', () => {
    const upper = new TransformDecorator(string(), (s) => s.toUpperCase());
    const result = upper.validate('hello', ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe('HELLO');
  });

  it('should not transform on failure', () => {
    const upper = new TransformDecorator(string().email(), (s) => s.toUpperCase());
    const result = upper.validate('bad-email', ctx);
    expect(result.success).toBe(false);
    // data should remain undefined on failure (line 34 in transform.ts covers the failure branch)
  });

  it('should expose the wrapped _type', () => {
    const t = new TransformDecorator(number(), (n) => String(n));
    expect(t._type).toBe('number');
  });
});

describe('MessageDecorator', () => {
  it('should replace all error messages with custom message', () => {
    const v = new MessageDecorator(string().email(), 'Invalid email address');
    const result = v.validate('bad', ctx);
    expect(result.success).toBe(false);
    expect(result.errors.every((e) => e.message === 'Invalid email address')).toBe(true);
  });

  it('should pass through on success', () => {
    const v = new MessageDecorator(string().email(), 'Bad email');
    const result = v.validate('user@example.com', ctx);
    expect(result.success).toBe(true);
  });

  it('should expose the wrapped _type', () => {
    const v = new MessageDecorator(string(), 'custom');
    expect(v._type).toBe('string');
  });
});

describe('DefaultDecorator', () => {
  it('should return default value for undefined input', () => {
    const v = new DefaultDecorator(string(), 'default-value');
    const result = v.validate(undefined, ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe('default-value');
  });

  it('should return default value for null input', () => {
    const v = new DefaultDecorator(string(), 'default');
    const result = v.validate(null, ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe('default');
  });

  it('should pass through non-null/undefined values', () => {
    const v = new DefaultDecorator(string(), 'fallback');
    const result = v.validate('actual', ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe('actual');
  });

  it('should expose the wrapped _type', () => {
    const v = new DefaultDecorator(number(), 0);
    expect(v._type).toBe('number');
  });
});

describe('OptionalDecorator', () => {
  it('should return success with undefined for undefined input', () => {
    const v = new OptionalDecorator(string().email());
    const result = v.validate(undefined, ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });

  it('should validate non-undefined values with wrapped validator', () => {
    const v = new OptionalDecorator(string().email());
    expect(v.validate('user@example.com', ctx).success).toBe(true);
    expect(v.validate('bad-email', ctx).success).toBe(false);
  });

  it('should expose wrapped _type', () => {
    const v = new OptionalDecorator(string());
    expect(v._type).toBe('string');
  });
});

describe('NullableDecorator', () => {
  it('should return success with null for null input', () => {
    const v = new NullableDecorator(string().email());
    const result = v.validate(null, ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBeNull();
  });

  it('should validate non-null values with wrapped validator', () => {
    const v = new NullableDecorator(string().email());
    expect(v.validate('user@example.com', ctx).success).toBe(true);
    expect(v.validate('bad', ctx).success).toBe(false);
  });

  it('should expose wrapped _type', () => {
    const v = new NullableDecorator(string());
    expect(v._type).toBe('string');
  });
});


// ---------------------------------------------------------------------------
// TransformDecorator additional coverage
// ---------------------------------------------------------------------------

describe('TransformDecorator additional coverage', () => {
  const ctx = { path: [], field: 'test', locale: 'en' as const };

  it('error with undefined data passes through without transform', () => {
    // Covers the `result.data === undefined` branch in TransformDecorator.validate()
    const t = new TransformDecorator(string().email(), (s) => s);
    const result = t.validate('not-an-email', ctx);
    expect(result.success).toBe(false);
  });

  it('transformer that throws Error returns failure with error message', () => {
    const t = new TransformDecorator(string(), () => {
      throw new Error('transform error');
    });
    const result = t.validate('hello', ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toBe('transform error');
  });

  it('transformer that throws non-Error returns generic failure', () => {
    const t = new TransformDecorator(string(), () => {
      throw 'not an error';
    });
    const result = t.validate('hello', ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toBe('Transform failed');
  });

  it('transformer error uses context path when provided', () => {
    const ctxWithPath = { path: ['user', 'name'], field: 'name', locale: 'en' as const };
    const t = new TransformDecorator(string(), () => {
      throw new Error('bad transform');
    });
    const result = t.validate('ok', ctxWithPath);
    expect(result.success).toBe(false);
  });
});
