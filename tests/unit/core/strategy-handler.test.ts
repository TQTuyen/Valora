/**
 * StrategyHandler Tests
 */

import { StrategyHandler } from '@core/chain/strategy-handler';
import { ValidationPipeline } from '@core/chain/pipeline';
import { describe, expect, it } from 'vitest';

import type { IValidationStrategy, ValidationContext, ValidationResult } from '#types/index';

const ctx: ValidationContext = { path: ['test'], field: 'test', locale: 'en' };

// A sync strategy that always passes
class PassStrategy implements IValidationStrategy<string, string> {
  readonly name = 'pass';
  validate(value: string): ValidationResult<string> {
    return { success: true, data: value, errors: [] };
  }
}

// A sync strategy that always fails
class FailStrategy implements IValidationStrategy<string, string> {
  readonly name = 'fail';
  validate(_value: string, context: ValidationContext): ValidationResult<string> {
    return {
      success: false,
      data: undefined,
      errors: [{ code: 'fail', message: 'always fails', path: context.path, field: context.field }],
    };
  }
}

// An async strategy (to trigger the error branch - intentionally returns a Promise
// from a sync interface to test runtime handling)
class AsyncStrategy implements IValidationStrategy<string, string> {
  readonly name = 'async';
  validate(value: string): ValidationResult<string> {
    return Promise.resolve({ success: true, data: value, errors: [] }) as unknown as ValidationResult<string>;
  }
}

describe('StrategyHandler', () => {
  it('should process synchronous strategy and pass', () => {
    const handler = new StrategyHandler(new PassStrategy());
    const result = handler.handle('hello', ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe('hello');
  });

  it('should process synchronous strategy and fail', () => {
    const handler = new StrategyHandler(new FailStrategy());
    const result = handler.handle('hello', ctx);
    expect(result.success).toBe(false);
  });

  it('should throw when strategy returns a Promise', () => {
    const handler = new StrategyHandler(new AsyncStrategy() as unknown as IValidationStrategy<string, string>);
    expect(() => handler.handle('hello', ctx)).toThrow(
      'Strategy "async" is asynchronous and cannot be used in a synchronous validation pipeline',
    );
  });

  it('should work in a ValidationPipeline', () => {
    const pipeline = new ValidationPipeline<string>();
    pipeline.addHandler(new StrategyHandler(new PassStrategy()));
    pipeline.addHandler(new StrategyHandler(new PassStrategy()));
    const result = pipeline.execute('hello', ctx);
    expect(result.success).toBe(true);
  });
});
