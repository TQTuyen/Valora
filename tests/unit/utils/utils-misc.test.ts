/**
 * Utility functions tests: clone, id, path, type-guards
 */

import { interpolate, capitalize } from '@utils/string';
import { deepClone } from '@utils/clone';
import { uniqueId } from '@utils/id';
import { pathToString, stringToPath, getByPath, setByPath } from '@utils/path';
import {
  isObject, isString, isNumber, isBoolean, isDate, isArray, isFunction, isNil, isEmpty,
} from '@utils/type-guards';
import { describe, expect, it } from 'vitest';

// ─── string utils ────────────────────────────────────────────────────────────

describe('interpolate', () => {
  it('should replace placeholders with values', () => {
    expect(interpolate('Hello, {name}!', { name: 'World' })).toBe('Hello, World!');
  });

  it('should return template unchanged when no params', () => {
    expect(interpolate('Hello, {name}!')).toBe('Hello, {name}!');
  });

  it('should leave unknown placeholders as-is', () => {
    expect(interpolate('{unknown}', {})).toBe('{unknown}');
  });
});

describe('capitalize (utils/string)', () => {
  it('should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should return empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });
});

// ─── deepClone ───────────────────────────────────────────────────────────────

describe('deepClone', () => {
  it('should clone primitives as-is', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBeNull();
  });

  it('should clone a Date', () => {
    const d = new Date('2024-01-01');
    const cloned = deepClone(d);
    expect(cloned).toBeInstanceOf(Date);
    expect(cloned).not.toBe(d);
    expect(cloned.getTime()).toBe(d.getTime());
  });

  it('should clone an array deeply', () => {
    const arr = [1, { a: 2 }, [3]];
    const cloned = deepClone(arr);
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[1]).not.toBe(arr[1]);
  });

  it('should clone a RegExp', () => {
    const re = /hello/gi;
    const cloned = deepClone(re);
    expect(cloned).toBeInstanceOf(RegExp);
    expect(cloned.source).toBe(re.source);
    expect(cloned.flags).toBe(re.flags);
    expect(cloned).not.toBe(re);
  });

  it('should deep clone a plain object', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
  });
});

// ─── uniqueId ────────────────────────────────────────────────────────────────

describe('uniqueId', () => {
  it('should return a string starting with default prefix', () => {
    const id = uniqueId();
    expect(id.startsWith('valora_')).toBe(true);
  });

  it('should respect custom prefix', () => {
    const id = uniqueId('test');
    expect(id.startsWith('test_')).toBe(true);
  });

  it('should generate unique IDs', () => {
    const a = uniqueId();
    const b = uniqueId();
    expect(a).not.toBe(b);
  });
});

// ─── pathToString ────────────────────────────────────────────────────────────

describe('pathToString', () => {
  it('should return empty string for empty path', () => {
    expect(pathToString([])).toBe('');
  });

  it('should handle simple string path', () => {
    expect(pathToString(['user'])).toBe('user');
  });

  it('should handle nested string path', () => {
    expect(pathToString(['user', 'name'])).toBe('user.name');
  });

  it('should handle numeric segments as brackets', () => {
    expect(pathToString(['items', 0, 'name'])).toBe('items[0].name');
  });

  it('should handle leading number', () => {
    expect(pathToString([0, 'name'])).toBe('[0].name');
  });
});

// ─── stringToPath ────────────────────────────────────────────────────────────

describe('stringToPath', () => {
  it('should return empty array for empty string', () => {
    expect(stringToPath('')).toEqual([]);
  });

  it('should parse a simple key', () => {
    expect(stringToPath('user')).toEqual(['user']);
  });

  it('should parse nested keys', () => {
    expect(stringToPath('user.name')).toEqual(['user', 'name']);
  });

  it('should parse array indices', () => {
    expect(stringToPath('items[0].name')).toEqual(['items', 0, 'name']);
  });

  it('should parse complex paths', () => {
    expect(stringToPath('a.b[2].c')).toEqual(['a', 'b', 2, 'c']);
  });
});

// ─── getByPath ───────────────────────────────────────────────────────────────

describe('getByPath', () => {
  it('should get a nested value', () => {
    expect(getByPath({ user: { name: 'Alice' } }, ['user', 'name'])).toBe('Alice');
  });

  it('should return undefined for missing path', () => {
    expect(getByPath({ a: 1 }, ['b', 'c'])).toBeUndefined();
  });

  it('should return undefined when traversing null', () => {
    expect(getByPath({ a: null }, ['a', 'b'])).toBeUndefined();
  });

  it('should return undefined when traversing non-object', () => {
    expect(getByPath({ a: 42 }, ['a', 'b'])).toBeUndefined();
  });

  it('should return the obj itself for empty path', () => {
    const obj = { a: 1 };
    expect(getByPath(obj, [])).toBe(obj);
  });
});

// ─── setByPath ───────────────────────────────────────────────────────────────

describe('setByPath', () => {
  it('should set a nested value', () => {
    const result = setByPath({ user: { name: 'Alice' } }, ['user', 'name'], 'Bob');
    expect((result as { user: { name: string } }).user.name).toBe('Bob');
  });

  it('should return value directly for empty path', () => {
    expect(setByPath({}, [], 'new-val')).toBe('new-val');
  });

  it('should create nested structure when obj is null', () => {
    const result = setByPath(null, ['a', 'b'], 42);
    expect(result).toEqual({ a: { b: 42 } });
  });

  it('should create array container for numeric head when obj is null', () => {
    const result = setByPath(null, [0], 'hello');
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle array index access', () => {
    const result = setByPath(['a', 'b', 'c'], [1], 'X');
    expect(result).toEqual(['a', 'X', 'c']);
  });

  it('should return obj unchanged for unexpected type', () => {
    const result = setByPath(42 as unknown, ['key'], 'val');
    expect(result).toBe(42);
  });
});

// ─── type-guards ─────────────────────────────────────────────────────────────

describe('type-guards', () => {
  describe('isObject', () => {
    it('should return true for plain objects', () => expect(isObject({ a: 1 })).toBe(true));
    it('should return false for null', () => expect(isObject(null)).toBe(false));
    it('should return false for arrays', () => expect(isObject([])).toBe(false));
    it('should return false for strings', () => expect(isObject('str')).toBe(false));
  });

  describe('isString', () => {
    it('should return true for strings', () => expect(isString('hello')).toBe(true));
    it('should return false for numbers', () => expect(isString(5)).toBe(false));
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => expect(isNumber(5)).toBe(true));
    it('should return false for NaN', () => expect(isNumber(NaN)).toBe(false));
    it('should return false for strings', () => expect(isNumber('5')).toBe(false));
  });

  describe('isBoolean', () => {
    it('should return true for booleans', () => expect(isBoolean(true)).toBe(true));
    it('should return false for numbers', () => expect(isBoolean(1)).toBe(false));
  });

  describe('isDate', () => {
    it('should return true for valid Date', () => expect(isDate(new Date())).toBe(true));
    it('should return false for invalid Date', () => expect(isDate(new Date('invalid'))).toBe(false));
    it('should return false for string', () => expect(isDate('2024')).toBe(false));
  });

  describe('isArray', () => {
    it('should return true for arrays', () => expect(isArray([])).toBe(true));
    it('should return false for objects', () => expect(isArray({})).toBe(false));
  });

  describe('isFunction', () => {
    it('should return true for functions', () => expect(isFunction(() => {})).toBe(true));
    it('should return false for strings', () => expect(isFunction('fn')).toBe(false));
  });

  describe('isNil', () => {
    it('should return true for null', () => expect(isNil(null)).toBe(true));
    it('should return true for undefined', () => expect(isNil(undefined)).toBe(true));
    it('should return false for 0', () => expect(isNil(0)).toBe(false));
  });

  describe('isEmpty', () => {
    it('should return true for null/undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });
    it('should return true for empty string', () => expect(isEmpty('')).toBe(true));
    it('should return false for non-empty string', () => expect(isEmpty('a')).toBe(false));
    it('should return true for whitespace string', () => expect(isEmpty('   ')).toBe(true));
    it('should return true for empty array', () => expect(isEmpty([])).toBe(true));
    it('should return false for non-empty array', () => expect(isEmpty([1])).toBe(false));
    it('should return true for empty object', () => expect(isEmpty({})).toBe(true));
    it('should return false for non-empty object', () => expect(isEmpty({ a: 1 })).toBe(false));
    it('should return false for numbers', () => expect(isEmpty(42)).toBe(false));
  });
});
