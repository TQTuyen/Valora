/**
 * Common Validator Strategies Tests
 * CustomStrategy, TypeCheckStrategy subclasses
 */

import { ArrayTypeStrategy } from '@validators/common/strategies/array-type';
import { BooleanTypeStrategy } from '@validators/common/strategies/boolean-type';
import { CustomStrategy } from '@validators/common/strategies/custom';
import { DateTypeStrategy } from '@validators/common/strategies/date-type';
import { NumberTypeStrategy } from '@validators/common/strategies/number-type';
import { ObjectTypeStrategy } from '@validators/common/strategies/object-type';
import { RequiredStrategy } from '@validators/common/strategies/required';
import { StringTypeStrategy } from '@validators/common/strategies/string-type';
import { describe, expect, it } from 'vitest';

const ctx = { path: ['field'], field: 'field', locale: 'en' as const };

describe('CustomStrategy', () => {
  it('should pass when validator returns true', () => {
    const strategy = new CustomStrategy((v: number) => v > 0, 'Must be positive', 'positive');
    expect(strategy.validate(5, ctx).success).toBe(true);
  });

  it('should fail when validator returns false', () => {
    const strategy = new CustomStrategy((v: number) => v > 0, 'Must be positive', 'positive');
    const result = strategy.validate(-1, ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toBe('Must be positive');
    expect(result.errors[0]?.code).toBe('positive');
  });

  it('should catch errors thrown by validator and return failure', () => {
    const strategy = new CustomStrategy(
      () => { throw new Error('unexpected!'); },
      'Custom error',
      'custom.error',
    );
    const result = strategy.validate('anything', ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toBe('unexpected!');
  });

  it('should handle non-Error throws with generic message', () => {
    const strategy = new CustomStrategy(
      () => { throw 'string error'; },
      'Custom error',
      'custom.error',
    );
    const result = strategy.validate('anything', ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toBe('Validation failed');
  });

  it('should include path in errors', () => {
    const strategy = new CustomStrategy(() => false, 'Bad', 'bad');
    const result = strategy.validate('val', ctx);
    expect(result.errors[0]?.path).toEqual(['field']);
  });
});

describe('DateTypeStrategy', () => {
  it('should pass for a valid Date object', () => {
    const strategy = new DateTypeStrategy();
    expect(strategy.validate(new Date(), ctx).success).toBe(true);
  });

  it('should fail for invalid Date object', () => {
    const strategy = new DateTypeStrategy();
    expect(strategy.validate(new Date('invalid'), ctx).success).toBe(false);
  });

  it('should fail for a string', () => {
    const strategy = new DateTypeStrategy();
    expect(strategy.validate('2024-01-01', ctx).success).toBe(false);
  });

  it('should fail for null', () => {
    const strategy = new DateTypeStrategy();
    expect(strategy.validate(null, ctx).success).toBe(false);
  });

  it('should have correct name and expectedType', () => {
    const strategy = new DateTypeStrategy();
    expect(strategy.name).toBe('dateType');
    expect(strategy.expectedType).toBe('date');
  });
});

describe('NumberTypeStrategy', () => {
  it('should pass for a valid number', () => {
    const strategy = new NumberTypeStrategy();
    expect(strategy.validate(42, ctx).success).toBe(true);
  });

  it('should pass for 0', () => {
    const strategy = new NumberTypeStrategy();
    expect(strategy.validate(0, ctx).success).toBe(true);
  });

  it('should fail for NaN', () => {
    const strategy = new NumberTypeStrategy();
    expect(strategy.validate(NaN, ctx).success).toBe(false);
  });

  it('should fail for a string', () => {
    const strategy = new NumberTypeStrategy();
    expect(strategy.validate('5', ctx).success).toBe(false);
  });

  it('should have correct name and expectedType', () => {
    const strategy = new NumberTypeStrategy();
    expect(strategy.name).toBe('numberType');
    expect(strategy.expectedType).toBe('number');
  });
});

describe('ObjectTypeStrategy', () => {
  it('should pass for a plain object', () => {
    const strategy = new ObjectTypeStrategy();
    expect(strategy.validate({ key: 'val' }, ctx).success).toBe(true);
  });

  it('should pass for an empty object', () => {
    const strategy = new ObjectTypeStrategy();
    expect(strategy.validate({}, ctx).success).toBe(true);
  });

  it('should fail for null', () => {
    const strategy = new ObjectTypeStrategy();
    expect(strategy.validate(null, ctx).success).toBe(false);
  });

  it('should fail for an array', () => {
    const strategy = new ObjectTypeStrategy();
    expect(strategy.validate([], ctx).success).toBe(false);
  });

  it('should fail for a string', () => {
    const strategy = new ObjectTypeStrategy();
    expect(strategy.validate('object', ctx).success).toBe(false);
  });

  it('should have correct name and expectedType', () => {
    const strategy = new ObjectTypeStrategy();
    expect(strategy.name).toBe('objectType');
    expect(strategy.expectedType).toBe('object');
  });
});

describe('ArrayTypeStrategy', () => {
  it('should pass for a valid array', () => {
    const strategy = new ArrayTypeStrategy();
    expect(strategy.validate([1, 2, 3], ctx).success).toBe(true);
  });

  it('should pass for an empty array', () => {
    const strategy = new ArrayTypeStrategy();
    expect(strategy.validate([], ctx).success).toBe(true);
  });

  it('should fail for a non-array value', () => {
    const strategy = new ArrayTypeStrategy();
    expect(strategy.validate('not-array', ctx).success).toBe(false);
  });

  it('should fail for null', () => {
    const strategy = new ArrayTypeStrategy();
    expect(strategy.validate(null, ctx).success).toBe(false);
  });

  it('should have correct name and expectedType', () => {
    const strategy = new ArrayTypeStrategy();
    expect(strategy.name).toBe('arrayType');
    expect(strategy.expectedType).toBe('array');
  });
});

describe('BooleanTypeStrategy', () => {
  it('should pass for true', () => {
    const strategy = new BooleanTypeStrategy();
    expect(strategy.validate(true, ctx).success).toBe(true);
  });

  it('should pass for false', () => {
    const strategy = new BooleanTypeStrategy();
    expect(strategy.validate(false, ctx).success).toBe(true);
  });

  it('should fail for a non-boolean value', () => {
    const strategy = new BooleanTypeStrategy();
    expect(strategy.validate('true', ctx).success).toBe(false);
  });

  it('should fail for null', () => {
    const strategy = new BooleanTypeStrategy();
    expect(strategy.validate(null, ctx).success).toBe(false);
  });

  it('should have correct name and expectedType', () => {
    const strategy = new BooleanTypeStrategy();
    expect(strategy.name).toBe('booleanType');
    expect(strategy.expectedType).toBe('boolean');
  });
});

describe('StringTypeStrategy', () => {
  it('should pass for a string', () => {
    const strategy = new StringTypeStrategy();
    expect(strategy.validate('hello', ctx).success).toBe(true);
  });

  it('should pass for an empty string', () => {
    const strategy = new StringTypeStrategy();
    expect(strategy.validate('', ctx).success).toBe(true);
  });

  it('should fail for a number', () => {
    const strategy = new StringTypeStrategy();
    expect(strategy.validate(42, ctx).success).toBe(false);
  });

  it('should fail for null', () => {
    const strategy = new StringTypeStrategy();
    expect(strategy.validate(null, ctx).success).toBe(false);
  });

  it('should have correct name and expectedType', () => {
    const strategy = new StringTypeStrategy();
    expect(strategy.name).toBe('stringType');
    expect(strategy.expectedType).toBe('string');
  });
});

describe('RequiredStrategy', () => {
  it('should fail for null with common.required code', () => {
    const strategy = new RequiredStrategy();
    const result = strategy.validate(null, ctx);
    expect(result.success).toBe(false);
  });

  it('should fail for undefined', () => {
    const strategy = new RequiredStrategy();
    const result = strategy.validate(undefined, ctx);
    expect(result.success).toBe(false);
  });

  it('should pass for non-null value', () => {
    const strategy = new RequiredStrategy();
    expect(strategy.validate('hello', ctx).success).toBe(true);
  });

  it('should use custom message from options', () => {
    const strategy = new RequiredStrategy({ message: 'Field is required' });
    const result = strategy.validate(null, ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toBe('Field is required');
  });
});
