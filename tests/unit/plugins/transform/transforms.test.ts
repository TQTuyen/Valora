/**
 * Transform functions tests — all categories
 */

import { describe, expect, it } from 'vitest';

// String transforms
import { trim, toLowerCase, toUpperCase, capitalize, capitalizeWords } from '@plugins/transform/transforms/string/case';
import { slug, camelCase, snakeCase, kebabCase } from '@plugins/transform/transforms/string/format';
import { removeWhitespace, normalizeWhitespace, removeNonAlphanumeric } from '@plugins/transform/transforms/string/removal';
import { replace, replaceAll } from '@plugins/transform/transforms/string/replacement';
import { toNumber, parseInt as parseIntTransform, parseFloat as parseFloatTransform } from '@plugins/transform/transforms/string/conversion';
import { substring, slice as strSlice } from '@plugins/transform/transforms/string/extraction';
import { padStart, padEnd } from '@plugins/transform/transforms/string/padding';
import { truncate } from '@plugins/transform/transforms/string/truncation';
import { reverse as strReverse, repeat, split } from '@plugins/transform/transforms/string/utility';

// Number transforms
import { add, subtract, multiply, divide, mod, pow } from '@plugins/transform/transforms/number/arithmetic';
import { round, floor, ceil, trunc } from '@plugins/transform/transforms/number/rounding';
import { clamp, min as numMin, max as numMax } from '@plugins/transform/transforms/number/clamping';
import { abs, negate, sign } from '@plugins/transform/transforms/number/sign';
import { sqrt, log, log10, exp } from '@plugins/transform/transforms/number/math';
import { toFixed, toPrecision } from '@plugins/transform/transforms/number/precision';
import { toString as numToString, toInt, toBase, toExponential } from '@plugins/transform/transforms/number/conversion';

// Array transforms
import { unique, compact, filter, removeNullish } from '@plugins/transform/transforms/array/filtering';
import { map, flatMap } from '@plugins/transform/transforms/array/mapping';
import { sort, sortBy, reverse as arrReverse, shuffle } from '@plugins/transform/transforms/array/sorting';
import { first, last, sum, average, minValue, maxValue } from '@plugins/transform/transforms/array/aggregation';
import { take, drop, takeLast, dropLast, slice as arrSlice } from '@plugins/transform/transforms/array/slicing';
import { join } from '@plugins/transform/transforms/array/joining';
import { flatten, flattenDeep, flattenDepth } from '@plugins/transform/transforms/array/flattening';
import { chunk, partition } from '@plugins/transform/transforms/array/chunking';
import { find, findIndex, includes, length, zip, groupBy } from '@plugins/transform/transforms/array/utility';

// ─── String: case ────────────────────────────────────────────────────────────

describe('String case transforms', () => {
  it('trim', () => expect(trim('  hello  ')).toBe('hello'));
  it('toLowerCase', () => expect(toLowerCase('HELLO')).toBe('hello'));
  it('toUpperCase', () => expect(toUpperCase('hello')).toBe('HELLO'));

  it('capitalize: capitalizes first letter', () => expect(capitalize('hello world')).toBe('Hello world'));
  it('capitalize: empty string returns empty', () => expect(capitalize('')).toBe(''));

  it('capitalizeWords: capitalizes each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
  });
  it('capitalizeWords: empty word in split', () => {
    expect(capitalizeWords('hello  world')).toBe('Hello  World');
  });
});

// ─── String: format ──────────────────────────────────────────────────────────

describe('String format transforms', () => {
  it('slug: converts to URL slug', () => expect(slug('Hello World!')).toBe('hello-world'));
  it('camelCase', () => expect(camelCase('hello world')).toBe('helloWorld'));
  it('snakeCase', () => expect(snakeCase('helloWorld')).toBe('hello_world'));
  it('kebabCase', () => expect(kebabCase('helloWorld')).toBe('hello-world'));
});

// ─── String: removal ─────────────────────────────────────────────────────────

describe('String removal transforms', () => {
  it('removeWhitespace', () => expect(removeWhitespace('hello world')).toBe('helloworld'));
  it('normalizeWhitespace', () => expect(normalizeWhitespace('  hello   world  ')).toBe('hello world'));
  it('removeNonAlphanumeric', () => expect(removeNonAlphanumeric('hello, world!')).toBe('helloworld'));
});

// ─── String: replacement ─────────────────────────────────────────────────────

describe('String replacement transforms', () => {
  it('replace: replaces first occurrence', () => {
    expect(replace('hello', 'hi')('hello hello')).toBe('hi hello');
  });
  it('replace: works with regex', () => {
    expect(replace(/\d+/g, 'NUM')('abc 123 def 456')).toBe('abc NUM def NUM');
  });
  it('replaceAll: replaces all occurrences', () => {
    expect(replaceAll('a', 'b')('banana')).toBe('bbnbnb');
  });
});

// ─── String: conversion ──────────────────────────────────────────────────────

describe('String conversion transforms', () => {
  it('toNumber: converts valid string', () => expect(toNumber('42')).toBe(42));
  it('toNumber: throws for invalid string', () => {
    expect(() => toNumber('abc')).toThrow();
  });

  it('parseInt: parses integer string', () => expect(parseIntTransform()('42')).toBe(42));
  it('parseInt: parses hex with radix 16', () => expect(parseIntTransform(16)('ff')).toBe(255));
  it('parseInt: throws for non-integer', () => {
    expect(() => parseIntTransform()('abc')).toThrow();
  });

  it('parseFloat: parses float string', () => expect(parseFloatTransform('3.14')).toBeCloseTo(3.14));
  it('parseFloat: throws for non-float', () => {
    expect(() => parseFloatTransform('abc')).toThrow();
  });
});

// ─── String: extraction ──────────────────────────────────────────────────────

describe('String extraction transforms', () => {
  it('substring(1, 4)', () => expect(substring(1, 4)('hello')).toBe('ell'));
  it('slice(1, 3)', () => expect(strSlice(1, 3)('hello')).toBe('el'));
  it('slice(-3)', () => expect(strSlice(-3)('hello')).toBe('llo'));
});

// ─── String: padding ─────────────────────────────────────────────────────────

describe('String padding transforms', () => {
  it('padStart', () => expect(padStart(5)('hi')).toBe('   hi'));
  it('padStart with custom char', () => expect(padStart(5, '0')('42')).toBe('00042'));
  it('padEnd', () => expect(padEnd(5)('hi')).toBe('hi   '));
});

// ─── String: truncation ──────────────────────────────────────────────────────

describe('String truncation transforms', () => {
  it('truncate: truncates long string', () => {
    expect(truncate(8)('hello world')).toBe('hello...');
  });
  it('truncate: returns as-is when short enough', () => {
    expect(truncate(20)('hello')).toBe('hello');
  });
  it('truncate: custom suffix', () => {
    expect(truncate(6, '…')('hello world')).toBe('hello…');
  });
});

// ─── String: utility ─────────────────────────────────────────────────────────

describe('String utility transforms', () => {
  it('reverse', () => expect(strReverse('hello')).toBe('olleh'));
  it('repeat', () => expect(repeat(3)('ab')).toBe('ababab'));
  it('split by space', () => expect(split(' ')('hello world')).toEqual(['hello', 'world']));
});

// ─── Number: arithmetic ──────────────────────────────────────────────────────

describe('Number arithmetic transforms', () => {
  it('add', () => expect(add(5)(10)).toBe(15));
  it('subtract', () => expect(subtract(3)(10)).toBe(7));
  it('multiply', () => expect(multiply(2)(5)).toBe(10));
  it('divide', () => expect(divide(2)(10)).toBe(5));
  it('divide by zero throws', () => expect(() => divide(0)(10)).toThrow('Division by zero'));
  it('mod', () => expect(mod(3)(10)).toBe(1));
  it('pow', () => expect(pow(2)(3)).toBe(9));
});

// ─── Number: rounding ────────────────────────────────────────────────────────

describe('Number rounding transforms', () => {
  it('round', () => expect(round(4.5)).toBe(5));
  it('floor', () => expect(floor(4.9)).toBe(4));
  it('ceil', () => expect(ceil(4.1)).toBe(5));
  it('trunc', () => expect(trunc(-4.9)).toBe(-4));
});

// ─── Number: clamping ────────────────────────────────────────────────────────

describe('Number clamping transforms', () => {
  it('clamp: clamps below min', () => expect(clamp(0, 100)(-5)).toBe(0));
  it('clamp: clamps above max', () => expect(clamp(0, 100)(200)).toBe(100));
  it('clamp: passes through in range', () => expect(clamp(0, 100)(50)).toBe(50));
  it('min: enforces minimum', () => expect(numMin(5)(2)).toBe(5));
  it('max: enforces maximum', () => expect(numMax(10)(20)).toBe(10));
});

// ─── Number: sign ────────────────────────────────────────────────────────────

describe('Number sign transforms', () => {
  it('abs', () => expect(abs(-5)).toBe(5));
  it('negate', () => expect(negate(5)).toBe(-5));
  it('sign positive', () => expect(sign(5)).toBe(1));
  it('sign negative', () => expect(sign(-5)).toBe(-1));
  it('sign zero', () => expect(sign(0)).toBe(0));
});

// ─── Number: math ────────────────────────────────────────────────────────────

describe('Number math transforms', () => {
  it('sqrt', () => expect(sqrt(9)).toBe(3));
  it('sqrt throws for negative', () => expect(() => sqrt(-1)).toThrow());
  it('log', () => expect(log(Math.E)).toBeCloseTo(1));
  it('log throws for 0', () => expect(() => log(0)).toThrow());
  it('log10', () => expect(log10(100)).toBeCloseTo(2));
  it('log10 throws for negative', () => expect(() => log10(-1)).toThrow());
  it('exp', () => expect(exp(0)).toBe(1));
});

// ─── Number: precision ───────────────────────────────────────────────────────

describe('Number precision transforms', () => {
  it('toFixed', () => expect(toFixed(2)(3.14159)).toBe('3.14'));
  it('toPrecision', () => expect(toPrecision(3)(3.14159)).toBe('3.14'));
});

// ─── Number: conversion ──────────────────────────────────────────────────────

describe('Number conversion transforms', () => {
  it('toString', () => expect(numToString(42)).toBe('42'));
  it('toInt', () => expect(toInt(3.9)).toBe(3));
  it('toBase hex', () => expect(toBase(16)(255)).toBe('ff'));
  it('toExponential', () => expect(toExponential(2)(12345)).toBe('1.23e+4'));
  it('toExponential no args', () => expect(typeof toExponential()(100)).toBe('string'));
});

// ─── Array: filtering ────────────────────────────────────────────────────────

describe('Array filtering transforms', () => {
  it('unique', () => expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3]));
  it('compact', () => expect(compact([0, 1, false, 2, '', 3])).toEqual([1, 2, 3]));
  it('filter', () => expect(filter((n: number) => n > 2)([1, 2, 3, 4])).toEqual([3, 4]));
  it('removeNullish', () => expect(removeNullish([1, null, 2, undefined, 3])).toEqual([1, 2, 3]));
});

// ─── Array: mapping ──────────────────────────────────────────────────────────

describe('Array mapping transforms', () => {
  it('map', () => expect(map((n: number) => n * 2)([1, 2, 3])).toEqual([2, 4, 6]));
  it('flatMap', () => expect(flatMap((n: number) => [n, n * 2])([1, 2])).toEqual([1, 2, 2, 4]));
});

// ─── Array: sorting ──────────────────────────────────────────────────────────

describe('Array sorting transforms', () => {
  it('sort: default sort', () => expect(sort()([3, 1, 2])).toEqual([1, 2, 3]));
  it('sort: custom comparator', () => {
    expect(sort((a: number, b: number) => b - a)([1, 2, 3])).toEqual([3, 2, 1]);
  });
  it('sortBy: ascending', () => {
    expect(sortBy<{ n: number }>('n')([{ n: 3 }, { n: 1 }])).toEqual([{ n: 1 }, { n: 3 }]);
  });
  it('sortBy: descending', () => {
    expect(sortBy<{ n: number }>('n', true)([{ n: 1 }, { n: 3 }])).toEqual([{ n: 3 }, { n: 1 }]);
  });
  it('sortBy: equal values return 0', () => {
    expect(sortBy<{ n: number }>('n')([{ n: 1 }, { n: 1 }])).toEqual([{ n: 1 }, { n: 1 }]);
  });
  it('reverse', () => expect(arrReverse([1, 2, 3])).toEqual([3, 2, 1]));
  it('shuffle: returns same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result).toHaveLength(arr.length);
    expect(result.sort()).toEqual(arr.sort());
  });
});

// ─── Array: aggregation ──────────────────────────────────────────────────────

describe('Array aggregation transforms', () => {
  it('first', () => expect(first([1, 2, 3])).toBe(1));
  it('last', () => expect(last([1, 2, 3])).toBe(3));
  it('sum', () => expect(sum([1, 2, 3])).toBe(6));
  it('average', () => expect(average([1, 2, 3])).toBe(2));
  it('average: empty returns 0', () => expect(average([])).toBe(0));
  it('minValue', () => expect(minValue([3, 1, 2])).toBe(1));
  it('maxValue', () => expect(maxValue([3, 1, 2])).toBe(3));
});

// ─── Array: slicing ──────────────────────────────────────────────────────────

describe('Array slicing transforms', () => {
  it('take', () => expect(take(2)([1, 2, 3])).toEqual([1, 2]));
  it('drop', () => expect(drop(2)([1, 2, 3])).toEqual([3]));
  it('takeLast', () => expect(takeLast(2)([1, 2, 3])).toEqual([2, 3]));
  it('dropLast', () => expect(dropLast(1)([1, 2, 3])).toEqual([1, 2]));
  it('slice', () => expect(arrSlice(1, 3)([1, 2, 3, 4])).toEqual([2, 3]));
});

// ─── Array: joining ──────────────────────────────────────────────────────────

describe('Array joining transforms', () => {
  it('join with comma (default)', () => expect(join()([1, 2, 3])).toBe('1,2,3'));
  it('join with separator', () => expect(join('-')([1, 2, 3])).toBe('1-2-3'));
});

// ─── Array: flattening ───────────────────────────────────────────────────────

describe('Array flattening transforms', () => {
  it('flatten', () => {
    const input: number[][] = [[1, 2], [3, 4]];
    expect(flatten(input)).toEqual([1, 2, 3, 4]);
  });
  it('flattenDeep', () => {
    const input = [1, [2, [3, [4]]]];
    expect(flattenDeep(input as unknown[])).toEqual([1, 2, 3, 4]);
  });
  it('flattenDepth', () => {
    const input = [1, [2, [3]]];
    expect(flattenDepth(1)(input as unknown[])).toEqual([1, 2, [3]]);
  });
});

// ─── Array: chunking ─────────────────────────────────────────────────────────

describe('Array chunking transforms', () => {
  it('chunk', () => expect(chunk(2)([1, 2, 3, 4])).toEqual([[1, 2], [3, 4]]));
  it('chunk: remainder', () => expect(chunk(2)([1, 2, 3])).toEqual([[1, 2], [3]]));
  it('partition', () => expect(partition(2)([1, 2, 3, 4])).toEqual([[1, 2], [3, 4]]));
});

// ─── Array: utility ──────────────────────────────────────────────────────────

describe('Array utility transforms', () => {
  it('find', () => expect(find((n: number) => n > 2)([1, 2, 3])).toBe(3));
  it('find: not found returns undefined', () => expect(find((n: number) => n > 10)([1, 2])).toBeUndefined());
  it('findIndex', () => expect(findIndex((n: number) => n > 2)([1, 2, 3])).toBe(2));
  it('includes', () => expect(includes(2)([1, 2, 3])).toBe(true));
  it('includes: not found', () => expect(includes(5)([1, 2, 3])).toBe(false));
  it('length', () => expect(length([1, 2, 3])).toBe(3));
  it('zip', () => {
    const result = zip([4, 5, 6])([1, 2, 3]);
    expect(result).toEqual([[1, 4], [2, 5], [3, 6]]);
  });
  it('groupBy', () => {
    const result = groupBy<{ type: string; val: number }>('type')([
      { type: 'a', val: 1 },
      { type: 'b', val: 2 },
      { type: 'a', val: 3 },
    ]);
    expect(result['a']).toHaveLength(2);
    expect(result['b']).toHaveLength(1);
  });
});
