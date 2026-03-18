/**
 * Validator Strategy Custom Messages Tests
 * Covers the `options?.message` constructor branches in all strategy classes
 */

import { string } from '@validators/string';
import { number } from '@validators/number';
import { compare } from '@validators/comparison';
import { date } from '@validators/date';
import { object } from '@validators/object';
import { file } from '@validators/file';
import { describe, expect, it } from 'vitest';

import { createContext } from '../../helpers/test-utils';

const ctx = createContext();

describe('Strategy custom messages via ValidationOptions', () => {
  describe('String strategies', () => {
    it('alpha strategy should use custom message', () => {
      const v = string().alpha({ message: 'Letters only' });
      const result = v.validate('123', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Letters only');
    });

    it('alphanumeric strategy should use custom message', () => {
      const v = string().alphanumeric({ message: 'Alphanumeric only' });
      const result = v.validate('!@#', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Alphanumeric only');
    });

    it('email strategy should use custom message', () => {
      const v = string().email({ message: 'Bad email' });
      const result = v.validate('not-an-email', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Bad email');
    });

    it('url strategy should use custom message', () => {
      const v = string().url({ message: 'Bad URL' });
      const result = v.validate('not-a-url', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Bad URL');
    });

    it('uuid strategy should use custom message', () => {
      const v = string().uuid({ message: 'Bad UUID' });
      const result = v.validate('bad-uuid', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Bad UUID');
    });

    it('minLength strategy should use custom message', () => {
      const v = string().minLength(5, { message: 'Too short' });
      const result = v.validate('abc', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Too short');
    });

    it('maxLength strategy should use custom message', () => {
      const v = string().maxLength(3, { message: 'Too long' });
      const result = v.validate('toolong', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Too long');
    });

    it('length strategy should use custom message', () => {
      const v = string().length(5, { message: 'Wrong length' });
      const result = v.validate('abc', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Wrong length');
    });

    it('contains strategy should use custom message', () => {
      const v = string().contains('foo', { message: 'Must contain foo' });
      const result = v.validate('bar', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must contain foo');
    });

    it('startsWith strategy should use custom message', () => {
      const v = string().startsWith('hello', { message: 'Must start with hello' });
      const result = v.validate('world', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must start with hello');
    });

    it('endsWith strategy should use custom message', () => {
      const v = string().endsWith('world', { message: 'Must end with world' });
      const result = v.validate('hello', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must end with world');
    });

    it('notEmpty strategy should use custom message', () => {
      const v = string().notEmpty({ message: 'Cannot be empty' });
      const result = v.validate('', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Cannot be empty');
    });

    it('numeric strategy should use custom message', () => {
      const v = string().numeric({ message: 'Must be numeric' });
      const result = v.validate('abc', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be numeric');
    });

    it('lowercase strategy should use custom message', () => {
      const v = string().lowercase({ message: 'Must be lowercase' });
      const result = v.validate('HELLO', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be lowercase');
    });

    it('uppercase strategy should use custom message', () => {
      const v = string().uppercase({ message: 'Must be uppercase' });
      const result = v.validate('hello', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be uppercase');
    });

    it('pattern strategy should use custom message', () => {
      const v = string().pattern(/^\d+$/, { message: 'Digits only' });
      const result = v.validate('abc', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Digits only');
    });
  });

  describe('Comparison strategies', () => {
    it('greaterThan strategy should use custom message', () => {
      const v = compare<number>().greaterThan(10, { message: 'Must be > 10' });
      const result = v.validate(5, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be > 10');
    });

    it('greaterThanOrEqual strategy should use custom message', () => {
      const v = compare<number>().greaterThanOrEqual(10, { message: 'Must be >= 10' });
      const result = v.validate(5, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be >= 10');
    });

    it('lessThan strategy should use custom message', () => {
      const v = compare<number>().lessThan(10, { message: 'Must be < 10' });
      const result = v.validate(15, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be < 10');
    });

    it('lessThanOrEqual strategy should use custom message', () => {
      const v = compare<number>().lessThanOrEqual(10, { message: 'Must be <= 10' });
      const result = v.validate(15, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be <= 10');
    });

    it('notEqualTo strategy should use custom message', () => {
      const v = compare<number>().notEqualTo(0, { message: 'Cannot be zero' });
      const result = v.validate(0, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Cannot be zero');
    });

    it('notOneOf strategy should use custom message', () => {
      const v = compare<string>().notOneOf(['bad', 'evil'], { message: 'Forbidden value' });
      const result = v.validate('bad', ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Forbidden value');
    });

    it('sameAs strategy should use custom message', () => {
      const ctxWithData = { path: [], field: 'confirm', locale: 'en' as const, data: { password: 'secret' } };
      const v = compare<string>().sameAs('password', { message: 'Must match password' });
      const result = v.validate('other', ctxWithData);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must match password');
    });

    it('between strategy should use custom message', () => {
      const v = compare<number>().between(1, 10, { message: 'Must be between 1 and 10' });
      const result = v.validate(15, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be between 1 and 10');
    });
  });

  describe('Date strategies', () => {
    it('isAfter strategy should use custom message', () => {
      const v = date().after(new Date('2099-01-01'), { message: 'Must be after 2099' });
      const result = v.validate(new Date('2020-01-01'), ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be after 2099');
    });

    it('isBefore strategy should use custom message', () => {
      const v = date().before(new Date('2000-01-01'), { message: 'Must be before 2000' });
      const result = v.validate(new Date('2020-01-01'), ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be before 2000');
    });

    it('past strategy should use custom message', () => {
      const v = date().past({ message: 'Must be in the past' });
      const result = v.validate(new Date('2099-01-01'), ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be in the past');
    });

    it('future strategy should use custom message', () => {
      const v = date().future({ message: 'Must be in the future' });
      const result = v.validate(new Date('2000-01-01'), ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be in the future');
    });

    it('weekday strategy should use custom message', () => {
      // Find a Saturday to test weekday failure
      const saturday = new Date('2024-01-06'); // Saturday
      const v = date().weekday({ message: 'Must be a weekday' });
      const result = v.validate(saturday, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be a weekday');
    });

    it('weekend strategy should use custom message', () => {
      // Find a Monday to test weekend failure
      const monday = new Date('2024-01-08'); // Monday
      const v = date().weekend({ message: 'Must be a weekend' });
      const result = v.validate(monday, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be a weekend');
    });

    it('minAge strategy should use custom message', () => {
      const young = new Date(); // Age 0
      const v = date().minAge(18, { message: 'Must be at least 18' });
      const result = v.validate(young, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be at least 18');
    });

    it('maxAge strategy should use custom message', () => {
      const old = new Date('1900-01-01'); // Very old
      const v = date().maxAge(100, { message: 'Must be under 100 years old' });
      const result = v.validate(old, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be under 100 years old');
    });

    it('min (minDate) strategy should use custom message', () => {
      const v = date().min(new Date('2099-01-01'), { message: 'Date too early' });
      const result = v.validate(new Date('2000-01-01'), ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Date too early');
    });

    it('max (maxDate) strategy should use custom message', () => {
      const v = date().max(new Date('2000-01-01'), { message: 'Date too late' });
      const result = v.validate(new Date('2099-01-01'), ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Date too late');
    });
  });

  describe('Object strategies', () => {
    it('minKeys strategy should use custom message', () => {
      const v = object().minKeys(3, { message: 'Need at least 3 keys' });
      const result = v.validate({ a: 1 }, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Need at least 3 keys');
    });

    it('maxKeys strategy should use custom message', () => {
      const v = object().maxKeys(1, { message: 'Too many keys' });
      const result = v.validate({ a: 1, b: 2, c: 3 }, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Too many keys');
    });

    it('strict strategy should use custom message', () => {
      // Use empty schema so StrictStrategy runs without ShapeStrategy stripping keys first
      const v = object().strict({ message: 'No extra keys' });
      const result = v.validate({ name: 'John', extra: 'field' }, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('No extra keys');
    });
  });

  describe('File strategies', () => {
    it('minSize strategy should use custom message', () => {
      const v = file().minSize(1000, { message: 'File too small' });
      const result = v.validate({ type: 'image/jpeg', size: 500 }, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('File too small');
    });

    it('maxSize strategy should use custom message', () => {
      const v = file().maxSize(1000, { message: 'File too large' });
      const result = v.validate({ type: 'image/jpeg', size: 5000 }, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('File too large');
    });

    it('minSize formatBytes should handle KB range', () => {
      // 2048 bytes minimum, 1500 byte file fails → both formatted as KB
      const v = file().minSize(2048);
      const result = v.validate({ type: 'image/jpeg', size: 1500 }, ctx);
      expect(result.success).toBe(false);
    });

    it('minSize formatBytes should handle MB range', () => {
      const MB = 1024 * 1024;
      const v = file().minSize(2 * MB);
      const result = v.validate({ type: 'image/jpeg', size: MB }, ctx);
      expect(result.success).toBe(false);
    });

    it('minSize formatBytes should handle GB range', () => {
      const GB = 1024 * 1024 * 1024;
      const v = file().minSize(2 * GB);
      const result = v.validate({ type: 'image/jpeg', size: GB }, ctx);
      expect(result.success).toBe(false);
    });

    it('maxSize formatBytes should handle GB range', () => {
      const GB = 1024 * 1024 * 1024;
      const v = file().maxSize(GB);
      const result = v.validate({ type: 'image/jpeg', size: 2 * GB }, ctx);
      expect(result.success).toBe(false);
    });
  });

  describe('Number strategies', () => {
    it('min strategy should use custom message', () => {
      const v = number().min(10, { message: 'Too small' });
      const result = v.validate(5, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Too small');
    });

    it('max strategy should use custom message', () => {
      const v = number().max(10, { message: 'Too large' });
      const result = v.validate(20, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Too large');
    });

    it('positive strategy should use custom message', () => {
      const v = number().positive({ message: 'Must be positive' });
      const result = v.validate(-1, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be positive');
    });

    it('negative strategy should use custom message', () => {
      const v = number().negative({ message: 'Must be negative' });
      const result = v.validate(1, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be negative');
    });

    it('nonNegative strategy should use custom message', () => {
      const v = number().nonNegative({ message: 'Must be non-negative' });
      const result = v.validate(-1, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be non-negative');
    });

    it('nonPositive strategy should use custom message', () => {
      const v = number().nonPositive({ message: 'Must be non-positive' });
      const result = v.validate(1, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be non-positive');
    });

    it('integer strategy should use custom message', () => {
      const v = number().integer({ message: 'Must be integer' });
      const result = v.validate(1.5, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be integer');
    });

    it('finite strategy should use custom message', () => {
      const v = number().finite({ message: 'Must be finite' });
      const result = v.validate(Infinity, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be finite');
    });

    it('safe strategy should use custom message', () => {
      const v = number().safe({ message: 'Must be safe integer' });
      const result = v.validate(Number.MAX_SAFE_INTEGER + 1, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be safe integer');
    });

    it('multipleOf strategy should use custom message', () => {
      const v = number().multipleOf(5, { message: 'Must be multiple of 5' });
      const result = v.validate(7, ctx);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be multiple of 5');
    });
  });
});
