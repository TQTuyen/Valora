/**
 * Logic Validator Tests
 */

import { boolean } from '@validators/boolean';
import { compare } from '@validators/comparison';
import {
  allOf,
  and,
  anyOf,
  intersection,
  lazy,
  not,
  nullable,
  nullish,
  oneOf,
  optional,
  or,
  union,
  xor,
} from '@validators/logic';
import { number } from '@validators/number';
import { object } from '@validators/object';
import { string } from '@validators/string';
import { describe, it } from 'vitest';

import { createContext, expectFailure, expectSuccess } from '../../helpers/test-utils';

describe('Logic Validator', () => {
  const ctx = createContext();

  describe('Boolean Logic Combinators', () => {
    describe('and() / allOf()', () => {
      it('should validate when all validators pass', () => {
        const validator = and(string().minLength(3), string().maxLength(10));

        expectSuccess(validator.validate('hello', ctx));
        expectFailure(validator.validate('hi', ctx)); // Too short
        expectFailure(validator.validate('verylongstring', ctx)); // Too long
      });

      it('should work with allOf() alias', () => {
        const validator = allOf(number().positive(), number().max(99));

        expectSuccess(validator.validate(50, ctx));
        expectFailure(validator.validate(-10, ctx)); // Not positive
        expectFailure(validator.validate(150, ctx)); // Too large
      });

      it('should validate with multiple validators', () => {
        const validator = and(
          string().minLength(5),
          string().maxLength(20),
          string().contains('@'),
        );

        expectSuccess(validator.validate('user@example', ctx));
        expectFailure(validator.validate('user', ctx)); // No @
        expectFailure(validator.validate('@', ctx)); // Too short
      });
    });

    describe('or() / anyOf()', () => {
      it('should validate when any validator passes', () => {
        const validator = or(compare<string>().equalTo('yes'), compare<string>().equalTo('no'));

        expectSuccess(validator.validate('yes', ctx));
        expectSuccess(validator.validate('no', ctx));
        expectFailure(validator.validate('maybe', ctx));
      });

      it('should work with anyOf() alias', () => {
        const validator = anyOf(number().max(-1), number().min(101));

        expectSuccess(validator.validate(-10, ctx)); // Passes first
        expectSuccess(validator.validate(150, ctx)); // Passes second
        expectFailure(validator.validate(50, ctx)); // Passes neither
      });

      it('should pass if at least one succeeds', () => {
        const validator = or(
          string().minLength(20), // Very long
          string().email(), // Or email
          string().url(), // Or URL
        );

        expectSuccess(validator.validate('user@example.com', ctx)); // Email
        expectSuccess(validator.validate('https://example.com', ctx)); // URL
        expectSuccess(validator.validate('this is a very long string indeed', ctx)); // Long
        expectFailure(validator.validate('short', ctx)); // None
      });
    });

    describe('xor()', () => {
      it('should validate when exactly one validator passes', () => {
        const validator = xor(compare<string>().equalTo('a'), compare<string>().equalTo('b'));

        expectSuccess(validator.validate('a', ctx)); // Only first passes
        expectSuccess(validator.validate('b', ctx)); // Only second passes
        expectFailure(validator.validate('c', ctx)); // Neither passes
      });

      it('should fail when both validators pass', () => {
        const validator = xor(string().minLength(2), string().maxLength(10));

        expectSuccess(validator.validate('a', ctx)); // Only maxLength passes
        expectFailure(validator.validate('hello', ctx)); // Both pass
      });
    });

    describe('not()', () => {
      it('should invert validator result', () => {
        const validator = not(compare<string>().equalTo('forbidden'));

        expectSuccess(validator.validate('allowed', ctx));
        expectFailure(validator.validate('forbidden', ctx));
      });

      it('should work with complex validators', () => {
        const validator = not(number().between(10, 20));

        expectSuccess(validator.validate(5, ctx)); // Below range
        expectSuccess(validator.validate(25, ctx)); // Above range
        expectFailure(validator.validate(15, ctx)); // Within range
      });
    });

    describe('oneOf()', () => {
      it('should be alias for xor with two validators', () => {
        const validator = oneOf(compare<string>().equalTo('a'), compare<string>().equalTo('b'));

        expectSuccess(validator.validate('a', ctx)); // Only first passes
        expectSuccess(validator.validate('b', ctx)); // Only second passes
        expectFailure(validator.validate('c', ctx)); // Neither passes
      });

      it('should fail when multiple validators pass', () => {
        const validator = oneOf(
          string().minLength(2), // 'hello' passes
          string().maxLength(10), // 'hello' passes
        );

        expectFailure(validator.validate('hello', ctx)); // Both pass
        expectSuccess(validator.validate('a', ctx)); // Only second passes
      });
    });
  });

  describe('Type Combinators', () => {
    describe('union()', () => {
      it('should accept string or number', () => {
        const validator = union(string() as any, number() as any);

        expectSuccess(validator.validate('hello', ctx));
        expectSuccess(validator.validate(42, ctx));
        expectFailure(validator.validate(true, ctx));
        expectFailure(validator.validate(null, ctx));
      });

      it('should work with complex types', () => {
        const validator = union(
          string().email() as any,
          number().positive() as any,
          boolean() as any,
        );

        expectSuccess(validator.validate('user@example.com', ctx));
        expectSuccess(validator.validate(42, ctx));
        expectSuccess(validator.validate(true, ctx));
        expectFailure(validator.validate('not-email', ctx));
        expectFailure(validator.validate(-10, ctx));
      });
    });

    describe('intersection()', () => {
      it('should validate intersection of object types', () => {
        const validator = intersection(object({ name: string() }), object({ age: number() }));

        expectSuccess(validator.validate({ name: 'John', age: 30 }, ctx));
        expectFailure(validator.validate({ name: 'John' }, ctx)); // Missing age
        expectFailure(validator.validate({ age: 30 }, ctx)); // Missing name
      });

      it('should merge object schemas', () => {
        const validator = intersection(
          object({ id: number() }),
          object({ email: string().email() }),
          object({ active: boolean() }),
        );

        expectSuccess(
          validator.validate(
            {
              id: 1,
              email: 'user@example.com',
              active: true,
            },
            ctx,
          ),
        );

        expectFailure(
          validator.validate(
            {
              id: 1,
              email: 'invalid',
              active: true,
            },
            ctx,
          ),
        );
      });
    });
  });

  describe('Nullability', () => {
    describe('optional()', () => {
      it('should allow undefined', () => {
        const validator = optional(string());

        expectSuccess(validator.validate(undefined, ctx));
        expectSuccess(validator.validate('hello', ctx));
        expectFailure(validator.validate(null, ctx));
        expectFailure(validator.validate(123, ctx));
      });
    });

    describe('nullable()', () => {
      it('should allow null', () => {
        const validator = nullable(number());

        expectSuccess(validator.validate(null, ctx));
        expectSuccess(validator.validate(42, ctx));
        expectFailure(validator.validate(undefined, ctx));
        expectFailure(validator.validate('123', ctx));
      });
    });

    describe('nullish()', () => {
      it('should allow null or undefined', () => {
        const validator = nullish(string());

        expectSuccess(validator.validate(null, ctx));
        expectSuccess(validator.validate(undefined, ctx));
        expectSuccess(validator.validate('hello', ctx));
        expectFailure(validator.validate(123, ctx));
      });
    });
  });

  describe('Recursive Validation', () => {
    describe('lazy()', () => {
      it('should support simple recursive validation', () => {
        const nestedValidator: any = lazy(() =>
          or(string() as any, object({ nested: nestedValidator }) as any),
        );

        expectSuccess(nestedValidator.validate('leaf', ctx));
        expectSuccess(nestedValidator.validate({ nested: 'leaf' }, ctx));
        expectFailure(nestedValidator.validate(123, ctx));
      });
    });
  });

  describe('Real-world Scenarios', () => {
    it('should validate polymorphic user input', () => {
      const userInputValidator = union(
        string().email() as any,
        string().url() as any,
        number().positive() as any,
      );

      expectSuccess(userInputValidator.validate('user@example.com', ctx));
      expectSuccess(userInputValidator.validate('https://example.com', ctx));
      expectSuccess(userInputValidator.validate(42, ctx));
      expectFailure(userInputValidator.validate('invalid', ctx));
      expectFailure(userInputValidator.validate(-10, ctx));
    });

    it('should validate API response with multiple possible shapes', () => {
      const successResponse = object({
        status: compare<string>().equalTo('success'),
        data: object({}).optional(),
      });

      const errorResponse = object({
        status: compare<string>().equalTo('error'),
        error: string(),
      });

      const responseValidator = union(successResponse as any, errorResponse as any);

      expectSuccess(
        responseValidator.validate(
          {
            status: 'success',
            data: { id: 1 },
          },
          ctx,
        ),
      );

      expectSuccess(
        responseValidator.validate(
          {
            status: 'error',
            error: 'Not found',
          },
          ctx,
        ),
      );

      expectFailure(
        responseValidator.validate(
          {
            status: 'pending',
          },
          ctx,
        ),
      );
    });

    it('should validate complex combinations', () => {
      const validator = and(or(string().email(), string().url()), not(string().contains('test')));

      expectSuccess(validator.validate('user@example.com', ctx));
      expectSuccess(validator.validate('https://example.com', ctx));
      expectFailure(validator.validate('test@example.com', ctx)); // Contains 'test'
      expectFailure(validator.validate('invalid', ctx)); // Not email or URL
    });

    it('should validate with intersection and union', () => {
      const baseUser = object({
        id: number(),
        name: string(),
      });

      const withEmail = object({
        email: string().email(),
      });

      const withPhone = object({
        phone: string().minLength(10),
      });

      const userValidator = intersection(baseUser, union(withEmail as any, withPhone as any));

      expectSuccess(
        userValidator.validate(
          {
            id: 1,
            name: 'John',
            email: 'john@example.com',
          },
          ctx,
        ),
      );

      expectSuccess(
        userValidator.validate(
          {
            id: 2,
            name: 'Jane',
            phone: '1234567890',
          },
          ctx,
        ),
      );

      expectFailure(
        userValidator.validate(
          {
            id: 3,
            name: 'Bob',
            // Missing both email and phone
          },
          ctx,
        ),
      );
    });
  });
});
