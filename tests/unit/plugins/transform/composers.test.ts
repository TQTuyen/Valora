/**
 * Transform Composers Unit Tests
 * Tests all composer utilities: chain, compose, pipe, memoize, debounce, tap, when, attempt, sequence
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  attempt,
  chain,
  compose,
  debounce,
  memoize,
  pipe,
  sequence,
  tap,
  when,
} from '@/plugins/transform/composers';

describe('Transform Composers', () => {
  describe('pipe()', () => {
    it('should compose functions left-to-right', () => {
      const transform = pipe(
        (s: string) => s.trim(),
        (s: string) => s.toLowerCase(),
        (s: string) => s.replace(/\s+/g, '-'),
      );

      const result = transform('  Hello World  ');

      expect(result).toBe('hello-world');
    });

    it('should return identity function when no functions provided', () => {
      const transform = pipe<string>();

      expect(transform('test')).toBe('test');
    });

    it('should return the single function when only one provided', (): void => {
      const fn = (s: string): string => s.toUpperCase();
      const transform = pipe(fn);

      expect(transform).toBe(fn);
    });

    it('should handle number transformations', () => {
      const transform = pipe(
        (n: number) => n + 10,
        (n: number) => n * 2,
        (n: number) => n - 5,
      );

      expect(transform(5)).toBe(25); // (5 + 10) * 2 - 5 = 25
    });

    it('should handle array transformations', () => {
      const transform = pipe(
        (arr: number[]) => arr.map((n) => n * 2),
        (arr: number[]) => arr.filter((n) => n > 5),
        (arr: number[]) => arr.sort((a, b) => b - a),
      );

      expect(transform([1, 2, 3, 4, 5])).toEqual([10, 8, 6]);
    });

    it('should handle single transform', () => {
      const transform = pipe((s: string) => s.toUpperCase());

      expect(transform('hello')).toBe('HELLO');
    });
  });

  describe('compose()', () => {
    it('should compose functions right-to-left', () => {
      const transform = compose(
        (s: string) => s.replace(/\s+/g, '-'),
        (s: string) => s.toLowerCase(),
        (s: string) => s.trim(),
      );

      const result = transform('  Hello World  ');

      expect(result).toBe('hello-world');
    });

    it('should return identity function when no functions provided', () => {
      const transform = compose<string>();

      expect(transform('test')).toBe('test');
    });

    it('should return the single function when only one provided', (): void => {
      const fn = (s: string): string => s.toUpperCase();
      const transform = compose(fn);

      expect(transform).toBe(fn);
    });

    it('should handle number transformations', () => {
      const transform = compose(
        (n: number) => n - 5,
        (n: number) => n * 2,
        (n: number) => n + 10,
      );

      expect(transform(5)).toBe(25); // (5 + 10) * 2 - 5 = 25
    });

    it('should be opposite of pipe', () => {
      const pipeTransform = pipe(
        (n: number) => n + 1,
        (n: number) => n * 2,
      );

      const composeTransform = compose(
        (n: number) => n * 2,
        (n: number) => n + 1,
      );

      expect(pipeTransform(5)).toBe(composeTransform(5));
    });
  });

  describe('chain()', () => {
    it('should be an alias for pipe', () => {
      expect(chain).toBe(pipe);
    });

    it('should work exactly like pipe', () => {
      const transform = chain(
        (s: string) => s.trim(),
        (s: string) => s.toUpperCase(),
      );

      expect(transform('  hello  ')).toBe('HELLO');
    });
  });

  describe('memoize()', () => {
    it('should cache transform results', () => {
      let callCount = 0;
      const expensiveTransform = memoize((s: string) => {
        callCount++;
        return s.toUpperCase();
      });

      expensiveTransform('hello');
      expensiveTransform('hello');
      expensiveTransform('hello');

      expect(callCount).toBe(1);
    });

    it('should compute different results for different inputs', () => {
      let callCount = 0;
      const transform = memoize((s: string) => {
        callCount++;
        return s.toUpperCase();
      });

      const result1 = transform('hello');
      const result2 = transform('world');
      const result3 = transform('hello');

      expect(result1).toBe('HELLO');
      expect(result2).toBe('WORLD');
      expect(result3).toBe('HELLO');
      expect(callCount).toBe(2); // Only 2 unique inputs
    });

    it('should use custom key function', () => {
      let callCount = 0;
      const transform = memoize(
        (obj: { id: number; value: string }) => {
          callCount++;
          return obj.value.toUpperCase();
        },
        (obj) => String(obj.id),
      );

      transform({ id: 1, value: 'hello' });
      transform({ id: 1, value: 'different' }); // Same id, should use cache
      transform({ id: 2, value: 'world' });

      expect(callCount).toBe(2); // Only 2 unique IDs
    });

    it('should handle complex transformations', () => {
      const transform = memoize(
        (arr: number[]) => {
          return arr.reduce((sum, n) => sum + n, 0);
        },
        (arr) => arr.join(','),
      );

      expect(transform([1, 2, 3])).toBe(6);
      expect(transform([1, 2, 3])).toBe(6); // Cached
      expect(transform([1, 2, 3, 4])).toBe(10); // Different input
    });

    it('should cache null and undefined values', () => {
      let callCount = 0;
      const transform = memoize((v: unknown) => {
        callCount++;
        return v;
      });

      transform(null);
      transform(null);
      transform(undefined);
      transform(undefined);

      expect(callCount).toBe(2); // null and undefined are different
    });
  });

  describe('debounce()', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should debounce transform calls', async () => {
      let callCount = 0;
      const transform = debounce((s: string) => {
        callCount++;
        return s.toUpperCase();
      }, 100);

      void transform('hello');
      void transform('world');
      const promise3 = transform('test');

      expect(callCount).toBe(0); // Not called yet

      vi.advanceTimersByTime(100);
      const result = await promise3;

      expect(callCount).toBe(1); // Only called once with last value
      expect(result).toBe('TEST');
    });

    it('should return a promise', (): void => {
      const transform = debounce((s: string) => s.toUpperCase(), 100);

      const promise = transform('hello');

      expect(promise).toBeInstanceOf(Promise);
    });

    it('should resolve with transformed value', async () => {
      const transform = debounce((s: string) => s.toUpperCase(), 100);

      const promise = transform('hello');
      vi.advanceTimersByTime(100);

      const result = await promise;

      expect(result).toBe('HELLO');
    });

    it('should handle zero delay', async (): Promise<void> => {
      const transform = debounce((s: string) => s, 0);
      const promise = transform('test');
      vi.advanceTimersByTime(0);
      await promise;
    });

    it('should reset timer on new calls', async (): Promise<void> => {
      let callCount = 0;
      const transform = debounce((s: string) => {
        callCount++;
        return s;
      }, 100);

      void transform('first');
      vi.advanceTimersByTime(50);

      const promise2 = transform('second');
      vi.advanceTimersByTime(50);

      expect(callCount).toBe(0);

      vi.advanceTimersByTime(50);
      await promise2;

      expect(callCount).toBe(1);
    });

    it('should handle multiple independent debounced transforms', async () => {
      const transform1 = debounce((s: string) => `${s}1`, 100);
      const transform2 = debounce((s: string) => `${s}2`, 100);

      const promise1 = transform1('test');
      const promise2 = transform2('test');

      vi.advanceTimersByTime(100);

      expect(await promise1).toBe('test1');
      expect(await promise2).toBe('test2');
    });
  });

  describe('tap()', () => {
    it('should execute side effect without changing value', () => {
      let sideEffect = '';
      const transform = pipe(
        (s: string) => s.trim(),
        tap((s) => {
          sideEffect = `Processed: ${s}`;
        }),
        (s: string) => s.toUpperCase(),
      );

      const result = transform('  hello  ');

      expect(result).toBe('HELLO');
      expect(sideEffect).toBe('Processed: hello');
    });

    it('should allow multiple taps in pipeline', () => {
      const log: string[] = [];
      const transform = pipe(
        (n: number) => n + 1,
        tap((n) => log.push(`After +1: ${n.toString()}`)),
        (n: number) => n * 2,
        tap((n) => log.push(`After *2: ${n.toString()}`)),
        (n: number) => n - 3,
        tap((n) => log.push(`After -3: ${n.toString()}`)),
      );

      const result = transform(5);

      expect(result).toBe(9); // (5 + 1) * 2 - 3 = 9
      expect(log).toEqual(['After +1: 6', 'After *2: 12', 'After -3: 9']);
    });

    it('should not affect return value even if callback returns something', () => {
      const transform = tap((_: string) => {
        return 'this should be ignored';
      });

      expect(transform('original')).toBe('original');
    });

    it('should handle side effects with complex data', () => {
      const captured: object[] = [];
      const transform = tap((obj: object) => {
        captured.push({ ...obj });
      });

      const input = { a: 1, b: 2 };
      const result = transform(input);

      expect(result).toBe(input);
      expect(captured).toHaveLength(1);
      expect(captured[0]).toEqual({ a: 1, b: 2 });
    });
  });

  describe('when()', () => {
    it('should apply transform when condition is true', () => {
      const transform = when(
        (s: string) => s.length > 5,
        (s: string) => s.toUpperCase(),
      );

      expect(transform('hello world')).toBe('HELLO WORLD');
    });

    it('should not apply transform when condition is false', () => {
      const transform = when(
        (s: string) => s.length > 10,
        (s: string) => s.toUpperCase(),
      );

      expect(transform('hello')).toBe('hello');
    });

    it('should work in a pipeline', () => {
      const transform = pipe(
        (s: string) => s.trim(),
        when(
          (s: string) => s.length > 5,
          (s: string) => s.toUpperCase(),
        ),
        (s: string) => s.replace(/\s+/g, '-'),
      );

      expect(transform('  hello  ')).toBe('hello'); // Length <= 5, not uppercased
      expect(transform('  hello world  ')).toBe('HELLO-WORLD'); // Length > 5, uppercased
    });

    it('should handle number conditions', () => {
      const transform = when(
        (n: number) => n < 0,
        (n: number) => Math.abs(n),
      );

      expect(transform(-5)).toBe(5);
      expect(transform(5)).toBe(5);
    });

    it('should handle complex conditions', () => {
      const transform = when<{ age: number; adult?: boolean }>(
        (obj) => obj.age >= 18,
        (obj) => ({ ...obj, adult: true }),
      );

      expect(transform({ age: 20 })).toEqual({ age: 20, adult: true });
      expect(transform({ age: 15 })).toEqual({ age: 15 });
    });

    it('should allow nested when conditions', () => {
      const transform = when(
        (n: number) => n > 0,
        when(
          (n: number) => n > 100,
          (_n: number) => 100, // Clamp to 100
        ),
      );

      expect(transform(-5)).toBe(-5);
      expect(transform(50)).toBe(50);
      expect(transform(150)).toBe(100);
    });
  });

  describe('attempt()', () => {
    it('should return result of first successful transform', () => {
      const transform = attempt(
        (s: string) => {
          if (s !== 'valid') throw new Error('Invalid');
          return 'success';
        },
        () => 'fallback',
      );

      expect(transform('valid')).toBe('success');
      expect(transform('invalid')).toBe('fallback');
    });

    it('should try all transforms in order', () => {
      const attempts: number[] = [];
      const transform = attempt(
        (n: number) => {
          attempts.push(1);
          if (n < 10) throw new Error('Too small');
          return n * 2;
        },
        (n: number) => {
          attempts.push(2);
          if (n < 5) throw new Error('Still too small');
          return n * 3;
        },
        (n: number) => {
          attempts.push(3);
          return n * 4;
        },
      );

      expect(transform(15)).toBe(30); // First succeeds
      expect(attempts).toEqual([1]);

      attempts.length = 0;
      expect(transform(7)).toBe(21); // Second succeeds
      expect(attempts).toEqual([1, 2]);

      attempts.length = 0;
      expect(transform(3)).toBe(12); // Third succeeds
      expect(attempts).toEqual([1, 2, 3]);
    });

    it('should throw last error if all transforms fail', () => {
      const transform = attempt(
        () => {
          throw new Error('First error');
        },
        () => {
          throw new Error('Second error');
        },
        () => {
          throw new Error('Last error');
        },
      );

      expect(() => transform('test')).toThrow('Last error');
    });

    it('should throw if no transforms provided', () => {
      const transform = attempt();

      expect(() => transform('test')).toThrow('No transforms provided');
    });

    it('should handle parsing with fallbacks', () => {
      const parseNumber = attempt(
        (s: string) => {
          const result = parseInt(s, 10);
          if (isNaN(result) || s.includes('.')) throw new Error('Not a valid integer');
          return result;
        },
        (s: string) => {
          const result = parseFloat(s);
          if (isNaN(result)) throw new Error('Not a valid number');
          return result;
        },
        () => 0, // Default fallback
      );

      expect(parseNumber('42')).toBe(42);
      expect(parseNumber('3.14')).toBe(3.14);
      expect(parseNumber('invalid')).toBe(0);
    });

    it('should preserve the type of successful result', () => {
      const transform = attempt<string, string | number>(
        (s: string) => {
          if (s === 'number') return 42;
          throw new Error('Not a number');
        },
        (s: string) => {
          if (s === 'string') return 'text';
          throw new Error('Not a string');
        },
      );

      expect(transform('number')).toBe(42);
      expect(transform('string')).toBe('text');
    });
  });

  describe('sequence()', () => {
    it('should execute all transforms even if some fail', () => {
      const executed: number[] = [];
      const transform = sequence(
        (n: number) => {
          executed.push(1);
          return n + 1;
        },
        (_n: number) => {
          executed.push(2);
          throw new Error('This fails');
        },
        (n: number) => {
          executed.push(3);
          return n * 2;
        },
      );

      const result = transform(5);

      expect(executed).toEqual([1, 2, 3]);
      expect(result).toBe(12); // (5 + 1) * 2 = 12 (second transform failed, used result from first)
    });

    it('should continue with original value when transform fails', () => {
      const transform = sequence(
        (s: string) => s.trim(),
        (_s: string) => {
          throw new Error('Fail');
        },
        (s: string) => s.toUpperCase(),
      );

      expect(transform('  hello  ')).toBe('HELLO'); // Trimmed and uppercased
    });

    it('should handle all transforms succeeding', () => {
      const transform = sequence(
        (n: number) => n + 1,
        (n: number) => n * 2,
        (n: number) => n - 3,
      );

      expect(transform(5)).toBe(9); // (5 + 1) * 2 - 3 = 9
    });

    it('should handle all transforms failing', () => {
      const transform = sequence<string>(
        (s: string) => {
          throw new Error(`Fail 1 ${s}`);
        },
        (s: string) => {
          throw new Error(`Fail 2 ${s}`);
        },
        (s: string) => {
          throw new Error(`Fail 3 ${s}`);
        },
      );

      expect(transform('original')).toBe('original');
    });

    it('should be useful for sanitization with optional steps', () => {
      const sanitize = sequence(
        (s: string) => s.trim(),
        (s: string) => s.toLowerCase(),
        (s: string) => {
          // This might fail for some inputs
          if (s.includes('invalid')) throw new Error('Invalid content');
          return s.replace(/[^a-z0-9]/g, '');
        },
      );

      expect(sanitize('  Hello World  ')).toBe('helloworld');
      expect(sanitize('  Invalid Content  ')).toBe('invalid content'); // Trimmed and lowercased, but regex step failed
    });

    it('should handle empty sequence', () => {
      const transform = sequence<string>();

      expect(transform('test')).toBe('test');
    });
  });

  describe('Integration: Composer combinations', () => {
    it('should combine pipe and when', () => {
      const transform = pipe(
        (s: string) => s.trim(),
        when(
          (s: string) => s.length > 0,
          (s: string) => s.toUpperCase(),
        ),
      );

      expect(transform('  hello  ')).toBe('HELLO');
      expect(transform('     ')).toBe('');
    });

    it('should combine memoize and pipe', () => {
      let callCount = 0;
      const transform = memoize(
        pipe(
          (s: string) => {
            callCount++;
            return s.trim();
          },
          (s: string) => s.toUpperCase(),
        ),
      );

      transform('  hello  ');
      transform('  hello  ');

      expect(callCount).toBe(1);
    });

    it('should combine attempt and sequence', () => {
      const transform = attempt(
        sequence(
          (n: number) => n * 2,
          (n: number) => {
            if (n > 100) throw new Error('Too large');
            return n;
          },
        ),
        () => 100, // Fallback
      );

      expect(transform(40)).toBe(80);
      expect(transform(60)).toBe(120); // sequence continues with n*2 even when second step fails
    });

    it('should create complex transformation pipelines', () => {
      const log: string[] = [];

      const transform = pipe(
        (s: string) => s.trim(),
        tap((s) => log.push(`After trim: "${s}"`)),
        when(
          (s: string) => s.length > 0,
          pipe(
            (s: string) => s.toLowerCase(),
            tap((s) => log.push(`After lowercase: "${s}"`)),
            (s: string) => s.replace(/\s+/g, '-'),
            tap((s) => log.push(`After replace: "${s}"`)),
          ),
        ),
      );

      const result = transform('  Hello World  ');

      expect(result).toBe('hello-world');
      expect(log).toHaveLength(3);
    });
  });
});
