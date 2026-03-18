/**
 * Schema validators tests
 * RecordValidator, TupleValidator, CoerceValidators, Special validators
 */

import { v } from '@schema/builder';
import { RecordValidator } from '@schema/record';
import { TupleValidator } from '@schema/tuple';
import { CoerceBooleanValidator } from '@schema/coerce/boolean';
import { CoerceNumberValidator } from '@schema/coerce/number';
import { CoerceStringValidator } from '@schema/coerce/string';
import { CoerceDateValidator } from '@schema/coerce/date';
import { AnyValidator } from '@schema/special/any';
import { NeverValidator } from '@schema/special/never';
import { NullValidator } from '@schema/special/null';
import { UndefinedValidator } from '@schema/special/undefined';
import { UnknownValidator } from '@schema/special/unknown';
import { VoidValidator } from '@schema/special/void';
import { string } from '@validators/string';
import { number } from '@validators/number';
import { describe, expect, it } from 'vitest';

const ctx = { path: [], field: '', locale: 'en' as const };

// ─── RecordValidator ────────────────────────────────────────────────────────

describe('RecordValidator', () => {
  it('should pass for valid object with string keys and number values', () => {
    const v = new RecordValidator(string(), number());
    const result = v.validate({ a: 1, b: 2 }, ctx);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ a: 1, b: 2 });
  });

  it('should fail when value is not an object', () => {
    const v = new RecordValidator(string(), number());
    expect(v.validate('not-object', ctx).success).toBe(false);
    expect(v.validate(null, ctx).success).toBe(false);
    expect(v.validate([], ctx).success).toBe(false);
  });

  it('should fail when a value does not validate', () => {
    const v = new RecordValidator(string(), number().min(10));
    const result = v.validate({ a: 5 }, ctx);
    expect(result.success).toBe(false);
  });

  it('should collect errors from invalid key validation', () => {
    const v = new RecordValidator(string().minLength(5), number());
    const result = v.validate({ ab: 1 }, ctx);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should use default context when none provided', () => {
    const v = new RecordValidator(string(), number());
    const result = v.validate({ a: 1 });
    expect(result.success).toBe(true);
  });

  it('should have _type = "record"', () => {
    const v = new RecordValidator(string(), number());
    expect(v._type).toBe('record');
  });
});

// ─── TupleValidator ─────────────────────────────────────────────────────────

describe('TupleValidator', () => {
  it('should pass for valid tuple', () => {
    const v = new TupleValidator([string(), number()] as const);
    const result = v.validate(['hello', 42], ctx);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(['hello', 42]);
  });

  it('should fail when value is not an array', () => {
    const v = new TupleValidator([string()] as const);
    expect(v.validate('not-array', ctx).success).toBe(false);
    expect(v.validate(null, ctx).success).toBe(false);
  });

  it('should fail when array length is wrong', () => {
    const v = new TupleValidator([string(), number()] as const);
    const result = v.validate(['only-one'], ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.code).toBe('tuple.length');
  });

  it('should fail when element validation fails', () => {
    const v = new TupleValidator([string().email(), number()] as const);
    const result = v.validate(['not-email', 42], ctx);
    expect(result.success).toBe(false);
  });

  it('should use default context when none provided', () => {
    const v = new TupleValidator([string()] as const);
    expect(v.validate(['hello']).success).toBe(true);
  });

  it('should have _type = "tuple"', () => {
    const v = new TupleValidator([] as const);
    expect(v._type).toBe('tuple');
  });
});

// ─── CoerceBooleanValidator ─────────────────────────────────────────────────

describe('CoerceBooleanValidator', () => {
  it('should coerce truthy values to true', () => {
    const v = new CoerceBooleanValidator();
    expect(v.validate(1, ctx).data).toBe(true);
    expect(v.validate('yes', ctx).data).toBe(true);
    expect(v.validate(true, ctx).data).toBe(true);
  });

  it('should coerce falsy values to false', () => {
    const v = new CoerceBooleanValidator();
    expect(v.validate(0, ctx).data).toBe(false);
    expect(v.validate('', ctx).data).toBe(false);
    expect(v.validate(null, ctx).data).toBe(false);
  });

  it('should always succeed', () => {
    const v = new CoerceBooleanValidator();
    expect(v.validate(undefined, ctx).success).toBe(true);
  });

  it('should have _type = "coerce.boolean"', () => {
    expect(new CoerceBooleanValidator()._type).toBe('coerce.boolean');
  });
});

// ─── CoerceNumberValidator ──────────────────────────────────────────────────

describe('CoerceNumberValidator', () => {
  it('should coerce "42" to 42', () => {
    const v = new CoerceNumberValidator();
    const result = v.validate('42', ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe(42);
  });

  it('should coerce true to 1', () => {
    const v = new CoerceNumberValidator();
    expect(v.validate(true, ctx).data).toBe(1);
  });

  it('should fail for non-coercible values', () => {
    const v = new CoerceNumberValidator();
    expect(v.validate('not-a-number', ctx).success).toBe(false);
  });

  it('should use default context when none provided', () => {
    const v = new CoerceNumberValidator();
    expect(v.validate('abc').success).toBe(false);
  });

  it('should have _type = "coerce.number"', () => {
    expect(new CoerceNumberValidator()._type).toBe('coerce.number');
  });
});

// ─── CoerceStringValidator ──────────────────────────────────────────────────

describe('CoerceStringValidator', () => {
  it('should coerce number to string', () => {
    const v = new CoerceStringValidator();
    const result = v.validate(42, ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe('42');
  });

  it('should coerce boolean to string', () => {
    const v = new CoerceStringValidator();
    expect(v.validate(true, ctx).data).toBe('true');
  });

  it('should always succeed', () => {
    const v = new CoerceStringValidator();
    expect(v.validate(null, ctx).success).toBe(true);
    expect(v.validate(undefined, ctx).success).toBe(true);
  });

  it('should have _type = "coerce.string"', () => {
    expect(new CoerceStringValidator()._type).toBe('coerce.string');
  });
});

// ─── CoerceDateValidator ────────────────────────────────────────────────────

describe('CoerceDateValidator', () => {
  it('should pass through a Date instance', () => {
    const v = new CoerceDateValidator();
    const d = new Date('2024-01-01');
    const result = v.validate(d, ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe(d);
  });

  it('should coerce a date string to Date', () => {
    const v = new CoerceDateValidator();
    const result = v.validate('2024-01-01', ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBeInstanceOf(Date);
  });

  it('should coerce a timestamp number to Date', () => {
    const v = new CoerceDateValidator();
    const ts = Date.now();
    const result = v.validate(ts, ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBeInstanceOf(Date);
  });

  it('should fail for invalid string date', () => {
    const v = new CoerceDateValidator();
    expect(v.validate('not-a-date', ctx).success).toBe(false);
  });

  it('should fail for non-coercible values (object)', () => {
    const v = new CoerceDateValidator();
    expect(v.validate({ date: '2024' }, ctx).success).toBe(false);
  });

  it('should use default context when none provided', () => {
    const v = new CoerceDateValidator();
    expect(v.validate('invalid').success).toBe(false);
  });

  it('should have _type = "coerce.date"', () => {
    expect(new CoerceDateValidator()._type).toBe('coerce.date');
  });
});

// ─── Special Validators ─────────────────────────────────────────────────────

describe('AnyValidator', () => {
  it('should accept any value and return it', () => {
    const v = new AnyValidator();
    expect(v.validate('hello', ctx).success).toBe(true);
    expect(v.validate(42, ctx).data).toBe(42);
    expect(v.validate(null, ctx).success).toBe(true);
    expect(v.validate(undefined, ctx).success).toBe(true);
  });

  it('should have _type = "any"', () => {
    expect(new AnyValidator()._type).toBe('any');
  });
});

describe('UnknownValidator', () => {
  it('should accept any value and return it', () => {
    const v = new UnknownValidator();
    const obj = { key: 'val' };
    const result = v.validate(obj, ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe(obj);
  });

  it('should have _type = "unknown"', () => {
    expect(new UnknownValidator()._type).toBe('unknown');
  });
});

describe('NeverValidator', () => {
  it('should always fail', () => {
    const v = new NeverValidator();
    expect(v.validate('anything', ctx).success).toBe(false);
    expect(v.validate(null, ctx).success).toBe(false);
  });

  it('should use default context when none provided', () => {
    const v = new NeverValidator();
    expect(v.validate('x').success).toBe(false);
  });

  it('should have _type = "never"', () => {
    expect(new NeverValidator()._type).toBe('never');
  });
});

describe('NullValidator', () => {
  it('should pass for null', () => {
    const v = new NullValidator();
    const result = v.validate(null, ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBeNull();
  });

  it('should fail for non-null values', () => {
    const v = new NullValidator();
    expect(v.validate(undefined, ctx).success).toBe(false);
    expect(v.validate('', ctx).success).toBe(false);
    expect(v.validate(0, ctx).success).toBe(false);
  });

  it('should use default context when none provided', () => {
    const v = new NullValidator();
    expect(v.validate('x').success).toBe(false);
  });

  it('should have _type = "null"', () => {
    expect(new NullValidator()._type).toBe('null');
  });
});

describe('UndefinedValidator', () => {
  it('should pass for undefined', () => {
    const v = new UndefinedValidator();
    const result = v.validate(undefined, ctx);
    expect(result.success).toBe(true);
  });

  it('should fail for non-undefined values', () => {
    const v = new UndefinedValidator();
    expect(v.validate(null, ctx).success).toBe(false);
    expect(v.validate('', ctx).success).toBe(false);
  });

  it('should use default context when none provided', () => {
    const v = new UndefinedValidator();
    expect(v.validate(null).success).toBe(false);
  });

  it('should have _type = "undefined"', () => {
    expect(new UndefinedValidator()._type).toBe('undefined');
  });
});

describe('Schema builder (v)', () => {
  it('v.any() creates AnyValidator', () => {
    const v_ = v.any();
    expect(v_.validate('anything').success).toBe(true);
  });

  it('v.unknown() creates UnknownValidator', () => {
    expect(v.unknown().validate(42).success).toBe(true);
  });

  it('v.never() creates NeverValidator', () => {
    expect(v.never().validate('x').success).toBe(false);
  });

  it('v.void() creates VoidValidator', () => {
    expect(v.void().validate(undefined).success).toBe(true);
  });

  it('v.null() creates NullValidator', () => {
    expect(v.null().validate(null).success).toBe(true);
  });

  it('v.undefined() creates UndefinedValidator', () => {
    expect(v.undefined().validate(undefined).success).toBe(true);
  });

  it('v.record() creates RecordValidator', () => {
    const r = v.record(v.string(), v.number());
    expect(r.validate({ a: 1 }).success).toBe(true);
  });

  it('v.tuple() creates TupleValidator', () => {
    const t = v.tuple(v.string(), v.number());
    expect(t.validate(['hi', 42]).success).toBe(true);
  });

  it('v.coerce.string() creates CoerceStringValidator', () => {
    expect(v.coerce.string().validate(42).data).toBe('42');
  });

  it('v.coerce.number() creates CoerceNumberValidator', () => {
    expect(v.coerce.number().validate('5').data).toBe(5);
  });

  it('v.coerce.boolean() creates CoerceBooleanValidator', () => {
    expect(v.coerce.boolean().validate(1).data).toBe(true);
  });

  it('v.coerce.date() creates CoerceDateValidator', () => {
    expect(v.coerce.date().validate('2024-01-01').success).toBe(true);
  });
});

describe('VoidValidator', () => {
  it('should pass for undefined', () => {
    const v = new VoidValidator();
    const result = v.validate(undefined, ctx);
    expect(result.success).toBe(true);
  });

  it('should fail for non-undefined values', () => {
    const v = new VoidValidator();
    expect(v.validate(null, ctx).success).toBe(false);
    expect(v.validate(0, ctx).success).toBe(false);
  });

  it('should use default context when none provided', () => {
    const v = new VoidValidator();
    expect(v.validate('x').success).toBe(false);
  });

  it('should have _type = "void"', () => {
    expect(new VoidValidator()._type).toBe('void');
  });
});
