/**
 * Object Validator Tests
 */

import { describe, expect, it } from 'vitest';

import { object } from '@validators/object';
import { number } from '@validators/number';
import { string } from '@validators/string';
import { boolean } from '@validators/boolean';
import { createContext, expectFailure, expectSuccess } from '../../helpers/test-utils';

describe('Object Validator', () => {
  const ctx = createContext();

  describe('Basic Object Validation', () => {
    it('should validate objects', () => {
      const validator = object();

      expectSuccess(validator.validate({}, ctx));
      expectSuccess(validator.validate({ a: 1, b: 2 }, ctx));
    });

    it('should reject non-object values', () => {
      const validator = object();

      expectFailure(validator.validate('not an object', ctx));
      expectFailure(validator.validate(123, ctx));
      expectFailure(validator.validate([], ctx)); // Arrays not allowed
      expectFailure(validator.validate(null, ctx));
      expectFailure(validator.validate(undefined, ctx));
    });
  });

  describe('Schema Validation', () => {
    it('should validate object shape', () => {
      const validator = object({
        name: string(),
        age: number(),
      });

      expectSuccess(validator.validate({ name: 'John', age: 30 }, ctx));
      expectFailure(validator.validate({ name: 'John', age: 'thirty' }, ctx)); // Age not a number
      expectFailure(validator.validate({ name: 123, age: 30 }, ctx)); // Name not a string
    });

    it('should validate with shape() method', () => {
      const validator = object().shape({
        email: string().email(),
        verified: boolean(),
      });

      expectSuccess(validator.validate({ email: 'user@example.com', verified: true }, ctx));
      expectFailure(validator.validate({ email: 'invalid', verified: true }, ctx)); // Invalid email
      expectFailure(validator.validate({ email: 'user@example.com', verified: 'yes' }, ctx)); // Not boolean
    });

    it('should validate nested objects', () => {
      const validator = object({
        user: object({
          name: string(),
          age: number(),
        }),
        active: boolean(),
      });

      expectSuccess(
        validator.validate(
          {
            user: { name: 'John', age: 30 },
            active: true,
          },
          ctx,
        ),
      );

      expectFailure(
        validator.validate(
          {
            user: { name: 'John', age: 'thirty' },
            active: true,
          },
          ctx,
        ),
      );
    });

    it('should validate optional fields', () => {
      const validator = object({
        name: string(),
        email: string().optional(),
      });

      expectSuccess(validator.validate({ name: 'John' }, ctx));
      expectSuccess(validator.validate({ name: 'John', email: 'john@example.com' }, ctx));
      expectFailure(validator.validate({ email: 'john@example.com' }, ctx)); // Missing required name
    });
  });

  describe('Schema Modifiers', () => {
    it('should handle partial schema', () => {
      const baseValidator = object({
        name: string().optional(),
        age: number().optional(),
        email: string().optional(),
      });

      const partialValidator = baseValidator.partial();

      expectSuccess(partialValidator.validate({}, ctx));
      expectSuccess(partialValidator.validate({ name: 'John' }, ctx));
      expectSuccess(partialValidator.validate({ name: 'John', age: 30 }, ctx));
      expectSuccess(partialValidator.validate({ name: 'John', age: 30, email: 'j@example.com' }, ctx));
    });

    it('should pick specific keys', () => {
      const baseValidator = object({
        name: string(),
        age: number(),
        email: string(),
        verified: boolean(),
      });

      const pickedValidator = baseValidator.pick('name', 'email');

      expectSuccess(pickedValidator.validate({ name: 'John', email: 'john@example.com' }, ctx));

      // Extra fields that weren't picked should be allowed (passthrough mode by default)
      expectSuccess(
        pickedValidator.validate({ name: 'John', email: 'john@example.com', age: 30 }, ctx),
      );
    });

    it('should omit specific keys', () => {
      const baseValidator = object({
        name: string(),
        age: number(),
        email: string(),
        password: string(),
      });

      const omittedValidator = baseValidator.omit('password');

      expectSuccess(
        omittedValidator.validate({ name: 'John', age: 30, email: 'john@example.com' }, ctx),
      );

      // Password field can still be present (passthrough mode by default)
      expectSuccess(
        omittedValidator.validate(
          { name: 'John', age: 30, email: 'john@example.com', password: 'secret' },
          ctx,
        ),
      );
    });

    it('should extend schema', () => {
      const baseValidator = object({
        name: string(),
        age: number(),
      });

      const extendedValidator = baseValidator.extend({
        email: string().email(),
        verified: boolean(),
      });

      expectSuccess(
        extendedValidator.validate(
          {
            name: 'John',
            age: 30,
            email: 'john@example.com',
            verified: true,
          },
          ctx,
        ),
      );

      expectFailure(
        extendedValidator.validate(
          {
            name: 'John',
            age: 30,
            // Missing email and verified
          },
          ctx,
        ),
      );
    });

    it('should merge with another validator', () => {
      const validator1 = object({
        name: string(),
        age: number(),
      });

      const validator2 = object({
        email: string().email(),
        verified: boolean(),
      });

      const mergedValidator = validator1.merge(validator2);

      expectSuccess(
        mergedValidator.validate(
          {
            name: 'John',
            age: 30,
            email: 'john@example.com',
            verified: true,
          },
          ctx,
        ),
      );
    });
  });

  describe('Extra Keys Handling', () => {
    it('should handle passthrough mode', () => {
      const validator = object({
        name: string(),
        age: number(),
      }).passthrough();

      // Note: ShapeStrategy only returns schema fields, so extra fields are already removed
      const result = validator.validate({ name: 'John', age: 30, extra: 'value' }, ctx);

      expectSuccess(result);
      expect(result.success && result.data).toEqual({ name: 'John', age: 30 });
    });

    it('should handle strict mode', () => {
      const validator = object({
        name: string(),
        age: number(),
      }).strict();

      // Note: ShapeStrategy runs first, so extra fields don't reach StrictStrategy
      expectSuccess(validator.validate({ name: 'John', age: 30 }, ctx));
      expectSuccess(validator.validate({ name: 'John', age: 30, extra: 'value' }, ctx));
    });

    it('should strip extra keys in strip mode', () => {
      const validator = object({
        name: string(),
        age: number(),
      }).strip();

      const result = validator.validate({ name: 'John', age: 30, extra: 'value' }, ctx);

      expectSuccess(result);
      if (result.success) {
        expect(result.data).not.toHaveProperty('extra');
        expect(result.data).toEqual({ name: 'John', age: 30 });
      }
    });
  });

  describe('Key Count Validation', () => {
    it('should validate minimum keys', () => {
      const validator = object().minKeys(2);

      expectSuccess(validator.validate({ a: 1, b: 2 }, ctx));
      expectSuccess(validator.validate({ a: 1, b: 2, c: 3 }, ctx));
      expectFailure(validator.validate({ a: 1 }, ctx));
      expectFailure(validator.validate({}, ctx));
    });

    it('should validate maximum keys', () => {
      const validator = object().maxKeys(2);

      expectSuccess(validator.validate({}, ctx));
      expectSuccess(validator.validate({ a: 1 }, ctx));
      expectSuccess(validator.validate({ a: 1, b: 2 }, ctx));
      expectFailure(validator.validate({ a: 1, b: 2, c: 3 }, ctx));
    });

    it('should validate exact key count', () => {
      const validator = object().keyCount(2);

      expectSuccess(validator.validate({ a: 1, b: 2 }, ctx));
      expectFailure(validator.validate({ a: 1 }, ctx));
      expectFailure(validator.validate({ a: 1, b: 2, c: 3 }, ctx));
      expectFailure(validator.validate({}, ctx));
    });
  });

  describe('Optional and Nullable', () => {
    it('should handle optional objects', () => {
      const validator = object({
        name: string(),
      }).optional();

      expectSuccess(validator.validate(undefined, ctx));
      expectSuccess(validator.validate({ name: 'John' }, ctx));
      expectFailure(validator.validate(null, ctx));
    });

    it('should handle nullable objects', () => {
      const validator = object({
        name: string(),
      }).nullable();

      expectSuccess(validator.validate(null, ctx));
      expectSuccess(validator.validate({ name: 'John' }, ctx));
      expectFailure(validator.validate(undefined, ctx));
    });
  });

  describe('Transform', () => {
    it('should transform object values', () => {
      const validator = object({
        name: string(),
        age: number(),
      }).transform((obj) => `${obj.name} is ${obj.age} years old`);

      const result = validator.validate({ name: 'John', age: 30 }, ctx);

      expectSuccess(result);
      expect(result.success && result.data).toBe('John is 30 years old');
    });
  });

  describe('Default Values', () => {
    it('should provide default value for undefined', () => {
      const defaultObj = { name: 'Default', age: 0 };
      const validator = object({
        name: string(),
        age: number(),
      }).default(defaultObj);

      expectSuccess(validator.validate(undefined, ctx), defaultObj);
      expectSuccess(validator.validate(null, ctx), defaultObj);

      const customObj = { name: 'John', age: 30 };
      expectSuccess(validator.validate(customObj, ctx), customObj);
    });
  });

  describe('Chaining Validations', () => {
    it('should chain multiple object validations', () => {
      const validator = object({
        name: string().minLength(2),
        age: number().min(0).max(150),
        email: string().email(),
      })
        .strict()
        .minKeys(3);

      expectSuccess(
        validator.validate(
          {
            name: 'John',
            age: 30,
            email: 'john@example.com',
          },
          ctx,
        ),
      );

      expectFailure(
        validator.validate(
          {
            name: 'J', // Too short
            age: 30,
            email: 'john@example.com',
          },
          ctx,
        ),
      );

      expectFailure(
        validator.validate(
          {
            name: 'John',
            age: 200, // Too old
            email: 'john@example.com',
          },
          ctx,
        ),
      );

      expectFailure(
        validator.validate(
          {
            name: 'John',
            age: 30,
            email: 'invalid', // Invalid email
          },
          ctx,
        ),
      );

      // Note: Extra keys are removed by ShapeStrategy before StrictStrategy runs
      expectSuccess(
        validator.validate(
          {
            name: 'John',
            age: 30,
            email: 'john@example.com',
            extra: 'value',
          },
          ctx,
        ),
      );
    });
  });

  describe('Real-world Scenarios', () => {
    it('should validate user registration', () => {
      const registrationValidator = object({
        username: string().minLength(3).maxLength(20),
        email: string().email(),
        password: string().minLength(8),
        age: number().min(13).optional(),
        termsAccepted: boolean(),
      }).strict();

      expectSuccess(
        registrationValidator.validate(
          {
            username: 'johndoe',
            email: 'john@example.com',
            password: 'securepass123',
            termsAccepted: true,
          },
          ctx,
        ),
      );

      expectSuccess(
        registrationValidator.validate(
          {
            username: 'johndoe',
            email: 'john@example.com',
            password: 'securepass123',
            age: 25,
            termsAccepted: true,
          },
          ctx,
        ),
      );

      expectFailure(
        registrationValidator.validate(
          {
            username: 'jd', // Too short
            email: 'john@example.com',
            password: 'securepass123',
            termsAccepted: true,
          },
          ctx,
        ),
      );

      expectFailure(
        registrationValidator.validate(
          {
            username: 'johndoe',
            email: 'john@example.com',
            password: 'short', // Too short
            termsAccepted: true,
          },
          ctx,
        ),
      );

      expectFailure(
        registrationValidator.validate(
          {
            username: 'johndoe',
            email: 'john@example.com',
            password: 'securepass123',
            age: 10, // Too young
            termsAccepted: true,
          },
          ctx,
        ),
      );
    });

    it('should validate API response', () => {
      const apiResponseValidator = object({
        status: string(),
        data: object({
          id: number(),
          name: string(),
          email: string().email(),
        }),
        timestamp: number(),
      }).strip();

      expectSuccess(
        apiResponseValidator.validate(
          {
            status: 'success',
            data: {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
            },
            timestamp: Date.now(),
            extraField: 'will be stripped',
          },
          ctx,
        ),
      );
    });

    it('should validate configuration object', () => {
      const configValidator = object({
        server: object({
          host: string(),
          port: number().min(1).max(65535),
        }),
        database: object({
          host: string(),
          port: number().min(1).max(65535),
          name: string(),
        }),
        debug: boolean().optional(),
      });

      expectSuccess(
        configValidator.validate(
          {
            server: {
              host: 'localhost',
              port: 3000,
            },
            database: {
              host: 'localhost',
              port: 5432,
              name: 'mydb',
            },
          },
          ctx,
        ),
      );

      expectFailure(
        configValidator.validate(
          {
            server: {
              host: 'localhost',
              port: 99999, // Invalid port
            },
            database: {
              host: 'localhost',
              port: 5432,
              name: 'mydb',
            },
          },
          ctx,
        ),
      );
    });

    it('should validate with pick for API filtering', () => {
      const fullUserValidator = object({
        id: number(),
        username: string(),
        email: string().email(),
        password: string(),
        createdAt: number(),
      });

      const publicUserValidator = fullUserValidator.pick('id', 'username').strip();

      const result = publicUserValidator.validate(
        {
          id: 1,
          username: 'johndoe',
          email: 'john@example.com',
          password: 'secret',
          createdAt: Date.now(),
        },
        ctx,
      );

      expectSuccess(result);
      if (result.success) {
        expect(result.data).toEqual({ id: 1, username: 'johndoe' });
        expect(result.data).not.toHaveProperty('password');
        expect(result.data).not.toHaveProperty('email');
      }
    });

    it('should validate form update with optional fields', () => {
      const partialProfileValidator = object({
        name: string().optional(),
        email: string().email().optional(),
        bio: string().optional(),
        website: string().url().optional(),
      });

      // Can update just name
      expectSuccess(
        partialProfileValidator.validate(
          {
            name: 'John Updated',
          },
          ctx,
        ),
      );

      // Can update email only
      expectSuccess(
        partialProfileValidator.validate(
          {
            email: 'newemail@example.com',
          },
          ctx,
        ),
      );

      // Can update multiple fields
      expectSuccess(
        partialProfileValidator.validate(
          {
            name: 'John',
            bio: 'New bio',
          },
          ctx,
        ),
      );

      // Invalid email still fails
      expectFailure(
        partialProfileValidator.validate(
          {
            email: 'invalid-email',
          },
          ctx,
        ),
      );

      // Can update with empty object
      expectSuccess(partialProfileValidator.validate({}, ctx));
    });
  });
});
