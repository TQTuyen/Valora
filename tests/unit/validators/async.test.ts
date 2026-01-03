/**
 * Async Validator Tests
 */

import { async as asyncValidator } from '@validators/async';
import { describe, expect, it } from 'vitest';

import { createContext, delay, expectFailure, expectSuccess } from '../../helpers/test-utils';

describe('Async Validator', () => {
  const ctx = createContext();

  describe('Basic Async Validation', () => {
    it('should validate with async function', async () => {
      const validator = asyncValidator(async (value: string) => {
        await Promise.resolve();
        return {
          success: true,
          data: value.toUpperCase(),
          errors: [],
        };
      });

      const result = await validator.validateAsync('hello', ctx);

      expectSuccess(result, 'HELLO');
    });

    it('should fail with async function', async () => {
      const validator = asyncValidator(async () => {
        await Promise.resolve();
        return {
          success: false,
          data: undefined,
          errors: [
            {
              code: 'custom.error',
              message: 'Validation failed',
              path: [],
              field: '',
            },
          ],
        };
      });

      const result = await validator.validateAsync('test', ctx);

      expectFailure(result, 1);
    });

    it('should handle async errors', async () => {
      const validator = asyncValidator(() => {
        throw new Error('Async error');
      });

      const result = await validator.validateAsync('test', ctx);

      expectFailure(result);
      expect(result.errors[0]?.message).toContain('Async error');
    });
  });

  describe('Timeout Strategy', () => {
    it('should pass validation within timeout', async () => {
      const validator = asyncValidator(async (value: string) => {
        await delay(50);
        return {
          success: true,
          data: value,
          errors: [],
        };
      }).timeout(200);

      const result = await validator.validateAsync('test', ctx);

      expectSuccess(result, 'test');
    });

    it('should fail validation on timeout', async () => {
      const validator = asyncValidator(async (value: string) => {
        await delay(300);
        return {
          success: true,
          data: value,
          errors: [],
        };
      }).timeout(100);

      const result = await validator.validateAsync('test', ctx);

      expectFailure(result);
      expect(result.errors[0]?.message).toContain('timeout');
    });

    it('should use custom timeout message', async () => {
      const validator = asyncValidator(async (value: string) => {
        await delay(300);
        return {
          success: true,
          data: value,
          errors: [],
        };
      }).timeout(100, 'Custom timeout error');

      const result = await validator.validateAsync('test', ctx);

      expectFailure(result);
      expect(result.errors[0]?.message).toContain('Custom timeout error');
    });
  });

  describe('Debounce Strategy', () => {
    it('should debounce rapid validations', async () => {
      let callCount = 0;
      const validator = asyncValidator(async (value: string) => {
        callCount++;
        await Promise.resolve();
        return {
          success: true,
          data: value,
          errors: [],
        };
      }).debounce(100);

      // Trigger multiple validations rapidly
      void validator.validateAsync('test1', ctx);
      await delay(50);
      void validator.validateAsync('test2', ctx);
      await delay(50);
      const promise3 = validator.validateAsync('test3', ctx);

      // Wait for debounce to complete
      await promise3;
      await delay(150);

      // Should only call validation once (last call)
      expect(callCount).toBeLessThanOrEqual(1);
    });
  });

  describe('Retry Strategy', () => {
    it('should retry on failure', async () => {
      let attemptCount = 0;

      const validator = asyncValidator(async (value: string) => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('Temporary failure');
        }
        await Promise.resolve();
        return {
          success: true,
          data: value,
          errors: [],
        };
      }).retry({ maxAttempts: 3, initialDelay: 10, maxDelay: 100, backoffMultiplier: 2 });

      const result = await validator.validateAsync('test', ctx);

      expectSuccess(result, 'test');
      expect(attemptCount).toBe(3);
    });

    it('should fail after max retry attempts', async () => {
      let attemptCount = 0;

      const validator = asyncValidator(() => {
        attemptCount++;
        throw new Error('Persistent failure');
      }).retry(3);

      const result = await validator.validateAsync('test', ctx);

      expectFailure(result);
      expect(attemptCount).toBe(3);
    });
  });

  describe('Cancellation', () => {
    it('should cancel pending validation', async () => {
      const validator = asyncValidator(async (value: string) => {
        await delay(200);
        return {
          success: true,
          data: value,
          errors: [],
        };
      });

      const promise = validator.validateAsync('test', ctx);

      // Cancel immediately
      validator.cancel();

      const result = await promise;

      expectFailure(result);
      expect(result.errors[0]?.message).toContain('cancelled');
    });

    it('should track pending state', async () => {
      const validator = asyncValidator(async (value: string) => {
        await delay(100);
        return {
          success: true,
          data: value,
          errors: [],
        };
      });

      expect(validator.isPending()).toBe(false);

      const promise = validator.validateAsync('test', ctx);

      expect(validator.isPending()).toBe(true);

      await promise;

      expect(validator.isPending()).toBe(false);
    });

    it('should wait for completion', async () => {
      const validator = asyncValidator(async (value: string) => {
        await delay(100);
        return {
          success: true,
          data: value,
          errors: [],
        };
      });

      void validator.validateAsync('test', ctx);

      await validator.waitForCompletion();

      expect(validator.isPending()).toBe(false);
    });
  });

  describe('Chaining Strategies', () => {
    it('should chain timeout and debounce', async () => {
      const validator = asyncValidator(async (value: string) => {
        await delay(50);
        return {
          success: true,
          data: value,
          errors: [],
        };
      })
        .debounce(100)
        .timeout(200);

      const result = await validator.validateAsync('test', ctx);

      expectSuccess(result, 'test');
    });

    it('should chain retry and timeout', async () => {
      let attemptCount = 0;

      const validator = asyncValidator(async (value: string) => {
        attemptCount++;
        if (attemptCount < 2) {
          throw new Error('Retry me');
        }
        await Promise.resolve();
        return {
          success: true,
          data: value,
          errors: [],
        };
      })
        .retry(3)
        .timeout(1000);

      const result = await validator.validateAsync('test', ctx);

      expectSuccess(result, 'test');
      expect(attemptCount).toBe(2);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should validate username availability', async () => {
      const checkUsername = asyncValidator(async (username: string) => {
        await delay(100); // Simulate API call
        const taken = username === 'admin';
        return taken
          ? {
              success: false,
              data: undefined,
              errors: [
                {
                  code: 'username.taken',
                  message: 'Username is already taken',
                  path: [],
                  field: 'username',
                },
              ],
            }
          : {
              success: true,
              data: username,
              errors: [],
            };
      }).debounce(300);

      const result1 = await checkUsername.validateAsync('newuser', ctx);
      expectSuccess(result1, 'newuser');

      const result2 = await checkUsername.validateAsync('admin', ctx);
      expectFailure(result2);
    });

    it('should validate email with timeout', async () => {
      const validateEmail = asyncValidator(async (email: string) => {
        await delay(50);
        const isValid = email.includes('@');
        return isValid
          ? {
              success: true,
              data: email,
              errors: [],
            }
          : {
              success: false,
              data: undefined,
              errors: [
                {
                  code: 'email.invalid',
                  message: 'Invalid email',
                  path: [],
                  field: 'email',
                },
              ],
            };
      }).timeout(200);

      const result1 = await validateEmail.validateAsync('test@example.com', ctx);
      expectSuccess(result1);

      const result2 = await validateEmail.validateAsync('invalid', ctx);
      expectFailure(result2);
    });
  });
});
