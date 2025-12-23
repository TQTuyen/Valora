/**
 * Test Utilities
 * Common helpers for testing validators and strategies
 */

import { expect } from 'vitest';

import type { ValidationContext, ValidationError, ValidationResult } from '#types/index';

/**
 * Create a test validation context
 */
export function createContext(overrides: Partial<ValidationContext> = {}): ValidationContext {
  return {
    path: [],
    field: 'test',
    locale: 'en',
    data: undefined,
    ...overrides,
  };
}

/**
 * Create a test validation error
 */
export function createTestError(
  message: string,
  overrides: Partial<ValidationError> = {},
): ValidationError {
  return {
    code: 'test.error',
    message,
    path: [],
    field: 'test',
    ...overrides,
  };
}

/**
 * Assert validation success
 */
export function expectSuccess<T>(result: ValidationResult<T>, expectedData?: T): void {
  expect(result.success).toBe(true);
  expect(result.errors).toEqual([]);
  if (expectedData !== undefined) {
    expect(result.data).toEqual(expectedData);
  }
}

/**
 * Assert validation failure
 */
export function expectFailure<T>(result: ValidationResult<T>, expectedErrorCount?: number): void {
  expect(result.success).toBe(false);
  if (expectedErrorCount !== undefined) {
    expect(result.errors).toHaveLength(expectedErrorCount);
  } else {
    expect(result.errors.length).toBeGreaterThan(0);
  }
}

/**
 * Assert validation failure with specific error message
 */
export function expectFailureWithMessage<T>(
  result: ValidationResult<T>,
  messageSubstring: string,
): void {
  expect(result.success).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
  expect(result.errors[0]?.message).toContain(messageSubstring);
}

/**
 * Assert validation failure with specific error code
 */
export function expectFailureWithCode<T>(result: ValidationResult<T>, code: string): void {
  expect(result.success).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
  expect(result.errors[0]?.code).toBe(code);
}

/**
 * Create async delay for testing
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock async validation function that succeeds
 */
export function mockAsyncSuccess<T>(value: T, delayMs = 0): () => Promise<ValidationResult<T>> {
  return async () => {
    if (delayMs > 0) await delay(delayMs);
    return {
      success: true,
      data: value,
      errors: [],
    };
  };
}

/**
 * Mock async validation function that fails
 */
export function mockAsyncFailure<T>(
  message: string,
  delayMs = 0,
): () => Promise<ValidationResult<T>> {
  return async () => {
    if (delayMs > 0) await delay(delayMs);
    return {
      success: false,
      data: undefined,
      errors: [createTestError(message)],
    };
  };
}
