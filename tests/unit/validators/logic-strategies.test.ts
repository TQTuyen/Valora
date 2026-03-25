/**
 * Logic Validator Strategies — coverage for uncovered branches
 */

import { IfThenElseStrategy } from '@validators/logic/strategies/if-then-else';
import { IntersectionStrategy } from '@validators/logic/strategies/intersection';
import { LazyStrategy } from '@validators/logic/strategies/lazy';
import { NotStrategy } from '@validators/logic/strategies/not';
import { UnionStrategy } from '@validators/logic/strategies/union';
import { XorStrategy } from '@validators/logic/strategies/xor';
import { string } from '@validators/string';
import { number } from '@validators/number';
import { describe, expect, it } from 'vitest';

import { createContext } from '../../helpers/test-utils';

const ctx = createContext();

describe('IfThenElseStrategy', () => {
  it('should execute then-validator when condition passes', () => {
    const strategy = new IfThenElseStrategy(
      string().email(),
      string().minLength(5), // then: must be >=5 chars
    );
    // condition passes (valid email) and then passes (>=5 chars)
    expect(strategy.validate('user@example.com', ctx).success).toBe(true);
  });

  it('should fail when condition passes but then-validator fails', () => {
    const strategy = new IfThenElseStrategy(
      string().email(),
      string().minLength(100), // then: impossible length
    );
    const result = strategy.validate('a@b.com', ctx);
    expect(result.success).toBe(false);
  });

  it('should use custom message when condition passes but then fails', () => {
    const strategy = new IfThenElseStrategy(
      string().email(),
      string().minLength(100),
      undefined,
      { message: 'Conditional validation failed' },
    );
    const result = strategy.validate('a@b.com', ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toContain('Conditional validation failed');
  });

  it('should execute else-validator when condition fails', () => {
    const strategy = new IfThenElseStrategy(
      string().email(),
      string().minLength(100),
      string().minLength(3), // else: >=3 chars
    );
    // condition fails (not email) → else must pass (>=3 chars)
    expect(strategy.validate('hello', ctx).success).toBe(true);
  });

  it('should fail else-validator when condition fails', () => {
    const strategy = new IfThenElseStrategy(
      string().email(),
      string().minLength(100),
      string().minLength(100), // else: impossible length
    );
    const result = strategy.validate('hello', ctx);
    expect(result.success).toBe(false);
  });

  it('should use custom message when else-validator fails', () => {
    const strategy = new IfThenElseStrategy(
      string().email(),
      string().minLength(100),
      string().minLength(100),
      { message: 'Else validation failed' },
    );
    const result = strategy.validate('not-email', ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toContain('Else validation failed');
  });

  it('should return success when condition fails and no else-validator', () => {
    const strategy = new IfThenElseStrategy(
      string().email(),
      string().minLength(5),
    );
    // condition fails, no else → success
    expect(strategy.validate('not-email', ctx).success).toBe(true);
  });
});

describe('IntersectionStrategy', () => {
  it('should pass when all validators pass', () => {
    const strategy = new IntersectionStrategy([string().minLength(3), string().maxLength(10)]);
    expect(strategy.validate('hello', ctx).success).toBe(true);
  });

  it('should fail when any validator fails', () => {
    const strategy = new IntersectionStrategy([string().minLength(10), string().maxLength(20)]);
    expect(strategy.validate('short', ctx).success).toBe(false);
  });

  it('should fail and use custom message', () => {
    const strategy = new IntersectionStrategy([string().minLength(10)], { message: 'custom' });
    const result = strategy.validate('hi', ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toBe('custom');
  });

  it('should collect all errors from failing validators', () => {
    const strategy = new IntersectionStrategy([string().email(), string().minLength(50)]);
    const result = strategy.validate('bad', ctx);
    expect(result.success).toBe(false);
    // Should have errors from multiple validators
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
  });
});

describe('LazyStrategy', () => {
  it('should lazily evaluate validator and pass', () => {
    const strategy = new LazyStrategy(() => string().minLength(3));
    expect(strategy.validate('hello', ctx).success).toBe(true);
  });

  it('should lazily evaluate validator and fail', () => {
    const strategy = new LazyStrategy(() => string().minLength(10));
    expect(strategy.validate('hi', ctx).success).toBe(false);
  });

  it('should support custom message', () => {
    const strategy = new LazyStrategy(() => string().minLength(10), { message: 'lazy failed' });
    const result = strategy.validate('hi', ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toBe('lazy failed');
  });
});

describe('NotStrategy', () => {
  it('should pass when validator fails', () => {
    const strategy = new NotStrategy(string().email());
    // not an email → strategy passes
    expect(strategy.validate('not-an-email', ctx).success).toBe(true);
  });

  it('should fail when validator passes', () => {
    const strategy = new NotStrategy(string().email());
    // is an email → strategy fails
    expect(strategy.validate('user@example.com', ctx).success).toBe(false);
  });

  it('should use custom message on failure', () => {
    const strategy = new NotStrategy(string().email(), { message: 'Should not be email' });
    const result = strategy.validate('user@example.com', ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toBe('Should not be email');
  });
});

describe('UnionStrategy', () => {
  it('should pass when first validator passes', () => {
    const strategy = new UnionStrategy<unknown, unknown>([string().email(), number()]);
    expect(strategy.validate('user@example.com', ctx).success).toBe(true);
  });

  it('should fail when all validators fail', () => {
    const strategy = new UnionStrategy([string().email(), string().uuid()]);
    expect(strategy.validate('not-email-or-uuid', ctx).success).toBe(false);
  });

  it('should use custom message when all fail', () => {
    const strategy = new UnionStrategy([string().email()], { message: 'Union failed' });
    const result = strategy.validate('bad', ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toBe('Union failed');
  });
});

describe('XorStrategy', () => {
  it('should pass when exactly first validator passes but not second', () => {
    const strategy = new XorStrategy(string().email(), string().url());
    // email is valid, URL is not → exactly one passes
    expect(strategy.validate('user@example.com', ctx).success).toBe(true);
  });

  it('should pass when exactly second validator passes but not first', () => {
    const strategy = new XorStrategy(string().email(), string().minLength(3));
    // 'abc' is not an email but is >=3 chars
    expect(strategy.validate('abc', ctx).success).toBe(true);
  });

  it('should fail when both validators fail', () => {
    const strategy = new XorStrategy(string().email(), string().uuid());
    expect(strategy.validate('not-valid', ctx).success).toBe(false);
  });

  it('should fail when both validators pass', () => {
    // Both minLength(1) and maxLength(100) pass for 'hello'
    const strategy = new XorStrategy(string().minLength(1), string().maxLength(100));
    expect(strategy.validate('hello', ctx).success).toBe(false);
  });

  it('should use custom message on failure', () => {
    const strategy = new XorStrategy(string().email(), string().uuid(), { message: 'XOR failed' });
    const result = strategy.validate('bad', ctx);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toBe('XOR failed');
  });
});
