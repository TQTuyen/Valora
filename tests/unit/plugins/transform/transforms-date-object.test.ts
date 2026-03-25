/**
 * Date and Object transform functions tests
 */

import { describe, expect, it } from 'vitest';

// Date transforms
import { toISOString, toISODate, toUTCString, toDateString, toTimeString } from '@plugins/transform/transforms/date/formatting';
import { addDays, addHours, addMinutes, addMilliseconds, subtractDays, subtractHours } from '@plugins/transform/transforms/date/arithmetic';
import { toTimestamp, fromTimestamp, toMilliseconds, fromMilliseconds } from '@plugins/transform/transforms/date/timestamp';
import { getYear, getMonth, getDate, getDay, getHours, getMinutes, getSeconds } from '@plugins/transform/transforms/date/components';
import { startOfDay, endOfDay } from '@plugins/transform/transforms/date/boundaries';
import { toLocaleDateString, toLocaleTimeString, toLocaleString } from '@plugins/transform/transforms/date/locale';

// Object transforms
import { pick as objPick, omit as objOmit } from '@plugins/transform/transforms/object/selection';
import { mapValues, mapKeys, filterObject } from '@plugins/transform/transforms/object/mapping';
import { merge, defaults, deepMerge as objDeepMerge } from '@plugins/transform/transforms/object/merging';
import { freeze, seal } from '@plugins/transform/transforms/object/immutability';
import { keys, values, entries, fromEntries, clone as objClone, toJSON, fromJSON } from '@plugins/transform/transforms/object/utility';

const testDate = new Date('2024-06-15T12:30:45.000Z');

// ─── Date: formatting ────────────────────────────────────────────────────────

describe('Date formatting transforms', () => {
  it('toISOString', () => {
    expect(toISOString(testDate)).toBe('2024-06-15T12:30:45.000Z');
  });

  it('toISODate', () => {
    expect(toISODate(testDate)).toBe('2024-06-15');
  });

  it('toUTCString', () => {
    expect(typeof toUTCString(testDate)).toBe('string');
  });

  it('toDateString', () => {
    expect(typeof toDateString(testDate)).toBe('string');
  });

  it('toTimeString', () => {
    expect(typeof toTimeString(testDate)).toBe('string');
  });
});

// ─── Date: arithmetic ────────────────────────────────────────────────────────

describe('Date arithmetic transforms', () => {
  it('addDays', () => {
    const result = addDays(1)(testDate);
    expect(result.getDate()).toBe(testDate.getDate() + 1);
  });

  it('addHours', () => {
    const result = addHours(2)(testDate);
    const expected = new Date(testDate.getTime() + 2 * 3600000);
    expect(result.getHours()).toBe(expected.getHours());
  });

  it('addMinutes', () => {
    const result = addMinutes(30)(testDate);
    const expected = new Date(testDate.getTime() + 30 * 60000);
    expect(result.getMinutes()).toBe(expected.getMinutes());
  });

  it('addMilliseconds', () => {
    const result = addMilliseconds(1000)(testDate);
    expect(result.getTime()).toBe(testDate.getTime() + 1000);
  });

  it('subtractDays', () => {
    const result = subtractDays(1)(testDate);
    expect(result.getDate()).toBe(testDate.getDate() - 1);
  });

  it('subtractHours', () => {
    const result = subtractHours(2)(testDate);
    const expected = new Date(testDate.getTime() - 2 * 3600000);
    expect(result.getTime()).toBe(expected.getTime());
  });
});

// ─── Date: timestamp ─────────────────────────────────────────────────────────

describe('Date timestamp transforms', () => {
  it('toTimestamp: returns seconds', () => {
    expect(toTimestamp(testDate)).toBe(Math.floor(testDate.getTime() / 1000));
  });

  it('fromTimestamp: returns Date from seconds', () => {
    const ts = Math.floor(testDate.getTime() / 1000);
    const result = fromTimestamp(ts);
    expect(result).toBeInstanceOf(Date);
    expect(Math.floor(result.getTime() / 1000)).toBe(ts);
  });

  it('toMilliseconds', () => {
    expect(toMilliseconds(testDate)).toBe(testDate.getTime());
  });

  it('fromMilliseconds', () => {
    const ms = testDate.getTime();
    const result = fromMilliseconds(ms);
    expect(result.getTime()).toBe(ms);
  });
});

// ─── Date: components ────────────────────────────────────────────────────────

describe('Date component transforms', () => {
  it('getYear', () => expect(getYear(testDate)).toBe(2024));
  it('getMonth', () => expect(getMonth(testDate)).toBe(5)); // June = 5
  it('getDate', () => expect(getDate(testDate)).toBe(15));
  it('getDay', () => expect(typeof getDay(testDate)).toBe('number'));
  it('getHours', () => expect(typeof getHours(testDate)).toBe('number'));
  it('getMinutes', () => expect(typeof getMinutes(testDate)).toBe('number'));
  it('getSeconds', () => expect(typeof getSeconds(testDate)).toBe('number'));
});

// ─── Date: boundaries ────────────────────────────────────────────────────────

describe('Date boundary transforms', () => {
  it('startOfDay: sets time to midnight', () => {
    const result = startOfDay(testDate);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('endOfDay: sets time to 23:59:59.999', () => {
    const result = endOfDay(testDate);
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
    expect(result.getMilliseconds()).toBe(999);
  });
});

// ─── Date: locale ────────────────────────────────────────────────────────────

describe('Date locale transforms', () => {
  it('toLocaleDateString', () => {
    expect(typeof toLocaleDateString('en-US')(testDate)).toBe('string');
  });

  it('toLocaleTimeString', () => {
    expect(typeof toLocaleTimeString()(testDate)).toBe('string');
  });

  it('toLocaleString', () => {
    expect(typeof toLocaleString('en-US')(testDate)).toBe('string');
  });
});

// ─── Object: selection ───────────────────────────────────────────────────────

describe('Object selection transforms', () => {
  it('pick: picks specified keys', () => {
    const result = objPick(['a', 'b'])({ a: 1, b: 2, c: 3 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('pick: ignores missing keys', () => {
    const result = objPick(['x'])({ a: 1 });
    expect(result).toEqual({});
  });

  it('omit: omits specified keys', () => {
    const result = objOmit(['b'])({ a: 1, b: 2, c: 3 });
    expect(result).toEqual({ a: 1, c: 3 });
  });
});

// ─── Object: mapping ─────────────────────────────────────────────────────────

describe('Object mapping transforms', () => {
  it('mapValues: transforms values', () => {
    const result = mapValues((v: unknown) => (v as number) * 2)({ a: 1, b: 2 });
    expect(result).toEqual({ a: 2, b: 4 });
  });

  it('mapKeys: transforms keys', () => {
    const result = mapKeys((k: string) => k.toUpperCase())({ a: 1, b: 2 });
    expect(result).toEqual({ A: 1, B: 2 });
  });

  it('filterObject: filters by predicate', () => {
    const result = filterObject((v: unknown) => (v as number) > 1)({ a: 1, b: 2, c: 3 });
    expect(result).toEqual({ b: 2, c: 3 });
  });
});

// ─── Object: merging ─────────────────────────────────────────────────────────

describe('Object merging transforms', () => {
  it('merge: merges source into target', () => {
    expect(merge<Record<string, number>>({ b: 3 })({ a: 1, b: 2 })).toEqual({ a: 1, b: 3 });
  });

  it('defaults: source values only fill missing keys', () => {
    expect(defaults<Record<string, number>>({ a: 99, c: 3 })({ a: 1, b: 2 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('deepMerge: merges deeply nested objects', () => {
    const result = objDeepMerge({ a: { c: 3 } } as { a: { c: number } })({ a: { c: 0 } });
    expect((result as { a: { c: number } }).a.c).toBe(3);
  });

  it('deepMerge: overwrites non-object values', () => {
    const result = objDeepMerge({ a: 42 })({ a: 1 });
    expect(result.a).toBe(42);
  });
});

// ─── Object: immutability ────────────────────────────────────────────────────

describe('Object immutability transforms', () => {
  it('freeze: returns frozen object', () => {
    const result = freeze({ a: 1 });
    expect(Object.isFrozen(result)).toBe(true);
  });

  it('seal: returns sealed object', () => {
    const result = seal({ a: 1 });
    expect(Object.isSealed(result)).toBe(true);
  });
});

// ─── Object: utility ─────────────────────────────────────────────────────────

describe('Object utility transforms', () => {
  it('keys', () => expect(keys({ a: 1, b: 2 })).toEqual(['a', 'b']));
  it('values', () => expect(values({ a: 1, b: 2 })).toEqual([1, 2]));
  it('entries', () => expect(entries({ a: 1 })).toEqual([['a', 1]]));
  it('fromEntries', () => expect(fromEntries([['a', 1], ['b', 2]])).toEqual({ a: 1, b: 2 }));

  it('clone: shallow clone', () => {
    const obj = { a: 1, b: { c: 2 } };
    const result = objClone(obj);
    expect(result).toEqual(obj);
    expect(result).not.toBe(obj);
  });

  it('toJSON: serializes to JSON string', () => {
    expect(toJSON()({ a: 1 })).toBe('{"a":1}');
  });

  it('toJSON with space', () => {
    expect(toJSON(2)({ a: 1 })).toContain('\n');
  });

  it('fromJSON: parses JSON string', () => {
    expect(fromJSON('{"a":1}')).toEqual({ a: 1 });
  });
});
