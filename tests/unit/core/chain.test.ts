/**
 * Chain of Responsibility Pattern Tests
 */

import { BaseValidationHandler } from '@core/chain/base-handler';
import { ValidationPipeline } from '@core/chain/pipeline';
import { describe, expect, it } from 'vitest';

import type { ValidationContext, ValidationResult } from '#types/index';

const ctx: ValidationContext = { path: ['test'], field: 'test', locale: 'en' };

// Concrete handler that passes values through
class PassHandler extends BaseValidationHandler<string> {
  protected process(value: string, context: ValidationContext): ValidationResult<string> {
    return this.success(value, context);
  }
}

// Concrete handler that always fails
class FailHandler extends BaseValidationHandler<string> {
  protected process(_value: string, context: ValidationContext): ValidationResult<string> {
    return this.failure('test.fail', context, { detail: 'always fails' });
  }
}

// Handler that transforms value
class UpperHandler extends BaseValidationHandler<string> {
  protected process(value: string, context: ValidationContext): ValidationResult<string> {
    return this.success(value.toUpperCase(), context);
  }
}

describe('BaseValidationHandler', () => {
  it('should process and pass through successfully', () => {
    const handler = new PassHandler();
    const result = handler.handle('hello', ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe('hello');
  });

  it('should stop chain on failure', () => {
    const fail = new FailHandler();
    const pass = new PassHandler();
    fail.setNext(pass);
    const result = fail.handle('hello', ctx);
    expect(result.success).toBe(false);
  });

  it('should call next handler on success', () => {
    const upper = new UpperHandler();
    const pass = new PassHandler();
    upper.setNext(pass);
    const result = upper.handle('hello', ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe('HELLO');
  });

  it('setNext returns the next handler', () => {
    const a = new PassHandler();
    const b = new PassHandler();
    const returned = a.setNext(b);
    expect(returned).toBe(b);
  });

  it('failure should return ValidationResult with error message', () => {
    const fail = new FailHandler();
    const result = fail.handle('x', ctx);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].code).toBe('test.fail');
  });
});

describe('ValidationPipeline', () => {
  it('should return success for empty pipeline', () => {
    const pipeline = new ValidationPipeline<string>();
    const result = pipeline.execute('hello', ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe('hello');
  });

  it('should add handlers and chain them', () => {
    const pipeline = new ValidationPipeline<string>();
    pipeline.addHandler(new PassHandler());
    pipeline.addHandler(new UpperHandler());
    const result = pipeline.execute('hello', ctx);
    expect(result.success).toBe(true);
    expect(result.data).toBe('HELLO');
  });

  it('length should return count of handlers', () => {
    const pipeline = new ValidationPipeline<string>();
    pipeline.addHandler(new PassHandler());
    pipeline.addHandler(new PassHandler());
    expect(pipeline.length).toBe(2);
  });

  it('clear should reset pipeline', () => {
    const pipeline = new ValidationPipeline<string>();
    pipeline.addHandler(new PassHandler());
    pipeline.clear();
    expect(pipeline.length).toBe(0);
  });

  it('should stop on first failure', () => {
    const pipeline = new ValidationPipeline<string>();
    pipeline.addHandler(new FailHandler());
    pipeline.addHandler(new PassHandler());
    const result = pipeline.execute('hello', ctx);
    expect(result.success).toBe(false);
  });

  it('addHandler returns this for chaining', () => {
    const pipeline = new ValidationPipeline<string>();
    const ret = pipeline.addHandler(new PassHandler());
    expect(ret).toBe(pipeline);
  });
});
