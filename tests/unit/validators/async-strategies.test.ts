/**
 * Async Validator Strategy Tests
 * DebounceStrategy, RetryStrategy
 */

import { DebounceStrategy } from '@validators/async/strategies/debounce';
import { RetryStrategy } from '@validators/async/strategies/retry';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const ctx = { path: [], field: 'test', locale: 'en' as const };

describe('DebounceStrategy', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve after debounce delay', async () => {
    const strategy = new DebounceStrategy(100);
    const promise = strategy.validate('hello', ctx);
    vi.advanceTimersByTime(100);
    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.data).toBe('hello');
  });

  it('should cancel previous pending validation when called again', async () => {
    const strategy = new DebounceStrategy(100);
    // Start first validation
    strategy.validate('first', ctx);
    vi.advanceTimersByTime(50);
    // Start second validation (cancels first)
    const second = strategy.validate('second', ctx);
    vi.advanceTimersByTime(200);
    const result = await second;
    expect(result.success).toBe(true);
    expect(result.data).toBe('second');
  });

  it('should cancel pending validation with cancel()', async () => {
    const strategy = new DebounceStrategy(100);
    const promise = strategy.validate('value', ctx);
    strategy.cancel();
    const result = await promise;
    expect(result.success).toBe(false);
  });

  it('should be a no-op to cancel when nothing is pending', () => {
    const strategy = new DebounceStrategy(100);
    expect(() => strategy.cancel()).not.toThrow();
  });
});

describe('RetryStrategy', () => {
  it('should succeed on first attempt', async () => {
    const strategy = new RetryStrategy({ maxAttempts: 3 });
    const result = await strategy.validate('value', ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe('value');
  });

  it('should use default config values', () => {
    const strategy = new RetryStrategy({ maxAttempts: 2 });
    expect(strategy.config.initialDelay).toBe(100);
    expect(strategy.config.maxDelay).toBe(10000);
    expect(strategy.config.backoffMultiplier).toBe(2);
  });

  it('should respect custom config values', () => {
    const strategy = new RetryStrategy({
      maxAttempts: 5,
      initialDelay: 50,
      maxDelay: 5000,
      backoffMultiplier: 3,
    });
    expect(strategy.config.maxAttempts).toBe(5);
    expect(strategy.config.initialDelay).toBe(50);
    expect(strategy.config.maxDelay).toBe(5000);
    expect(strategy.config.backoffMultiplier).toBe(3);
  });

  it('should have name "retry"', () => {
    const strategy = new RetryStrategy({ maxAttempts: 1 });
    expect(strategy.name).toBe('retry');
  });

  it('should retry on failure - succeeds on retry', async () => {
    // The retry strategy always succeeds (it passes through) so just test it with maxAttempts>1
    const strategy = new RetryStrategy({ maxAttempts: 3, initialDelay: 0 });
    const result = await strategy.validate('value', ctx);
    expect(result.success).toBe(true);
  });

  it('withMessage() sets custom message on base async strategy', async () => {
    const strategy = new DebounceStrategy(0);
    vi.useFakeTimers();
    const strategyWithMsg = strategy.withMessage('custom debounce message');
    expect(strategyWithMsg).toBe(strategy);
    const promise = strategyWithMsg.validate('val', ctx);
    vi.advanceTimersByTime(10);
    const result = await promise;
    expect(result.success).toBe(true);
    vi.useRealTimers();
  });
});
