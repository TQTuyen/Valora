/**
 * Comparison Validator Tests
 */

import { compare, literal, nativeEnum, ref } from '@validators/comparison';
import { describe, it } from 'vitest';

import { createContext, expectFailure, expectSuccess } from '../../helpers/test-utils';

describe('Comparison Validator', () => {
  const ctx = createContext();

  describe('Equality Comparisons', () => {
    it('should validate equality with equalTo()', () => {
      const validator = compare<number>().equalTo(42);

      expectSuccess(validator.validate(42, ctx));
      expectFailure(validator.validate(41, ctx));
      expectFailure(validator.validate(43, ctx));
    });

    it('should validate equality with equals() alias', () => {
      const validator = compare<string>().equals('hello');

      expectSuccess(validator.validate('hello', ctx));
      expectFailure(validator.validate('world', ctx));
    });

    it('should validate equality with eq() alias', () => {
      const validator = compare<boolean>().eq(true);

      expectSuccess(validator.validate(true, ctx));
      expectFailure(validator.validate(false, ctx));
    });

    it('should validate inequality with notEqualTo()', () => {
      const validator = compare<number>().notEqualTo(0);

      expectSuccess(validator.validate(1, ctx));
      expectSuccess(validator.validate(-1, ctx));
      expectFailure(validator.validate(0, ctx));
    });

    it('should validate inequality with notEquals() alias', () => {
      const validator = compare<string>().notEquals('forbidden');

      expectSuccess(validator.validate('allowed', ctx));
      expectFailure(validator.validate('forbidden', ctx));
    });

    it('should validate inequality with neq() alias', () => {
      const validator = compare<number>().neq(10);

      expectSuccess(validator.validate(11, ctx));
      expectFailure(validator.validate(10, ctx));
    });
  });

  describe('Numeric Comparisons', () => {
    it('should validate greater than with greaterThan()', () => {
      const validator = compare<number>().greaterThan(10);

      expectSuccess(validator.validate(11, ctx));
      expectSuccess(validator.validate(100, ctx));
      expectFailure(validator.validate(10, ctx)); // Equal
      expectFailure(validator.validate(9, ctx)); // Less
    });

    it('should validate greater than with gt() alias', () => {
      const validator = compare<number>().gt(0);

      expectSuccess(validator.validate(1, ctx));
      expectFailure(validator.validate(0, ctx));
      expectFailure(validator.validate(-1, ctx));
    });

    it('should validate greater than or equal with greaterThanOrEqual()', () => {
      const validator = compare<number>().greaterThanOrEqual(10);

      expectSuccess(validator.validate(10, ctx)); // Equal
      expectSuccess(validator.validate(11, ctx)); // Greater
      expectFailure(validator.validate(9, ctx)); // Less
    });

    it('should validate greater than or equal with gte() alias', () => {
      const validator = compare<number>().gte(0);

      expectSuccess(validator.validate(0, ctx));
      expectSuccess(validator.validate(1, ctx));
      expectFailure(validator.validate(-1, ctx));
    });

    it('should validate less than with lessThan()', () => {
      const validator = compare<number>().lessThan(10);

      expectSuccess(validator.validate(9, ctx));
      expectSuccess(validator.validate(0, ctx));
      expectFailure(validator.validate(10, ctx)); // Equal
      expectFailure(validator.validate(11, ctx)); // Greater
    });

    it('should validate less than with lt() alias', () => {
      const validator = compare<number>().lt(0);

      expectSuccess(validator.validate(-1, ctx));
      expectFailure(validator.validate(0, ctx));
      expectFailure(validator.validate(1, ctx));
    });

    it('should validate less than or equal with lessThanOrEqual()', () => {
      const validator = compare<number>().lessThanOrEqual(10);

      expectSuccess(validator.validate(10, ctx)); // Equal
      expectSuccess(validator.validate(9, ctx)); // Less
      expectFailure(validator.validate(11, ctx)); // Greater
    });

    it('should validate less than or equal with lte() alias', () => {
      const validator = compare<number>().lte(0);

      expectSuccess(validator.validate(0, ctx));
      expectSuccess(validator.validate(-1, ctx));
      expectFailure(validator.validate(1, ctx));
    });

    it('should validate between range', () => {
      const validator = compare<number>().between(10, 20);

      expectSuccess(validator.validate(10, ctx)); // Min boundary
      expectSuccess(validator.validate(15, ctx)); // Within range
      expectSuccess(validator.validate(20, ctx)); // Max boundary
      expectFailure(validator.validate(9, ctx)); // Below min
      expectFailure(validator.validate(21, ctx)); // Above max
    });
  });

  describe('Date Comparisons', () => {
    it('should validate date greater than', () => {
      const refDate = new Date('2024-06-15');
      const validator = compare<Date>().greaterThan(refDate);

      expectSuccess(validator.validate(new Date('2024-06-16'), ctx));
      expectFailure(validator.validate(new Date('2024-06-15'), ctx));
      expectFailure(validator.validate(new Date('2024-06-14'), ctx));
    });

    it('should validate date less than', () => {
      const refDate = new Date('2024-06-15');
      const validator = compare<Date>().lessThan(refDate);

      expectSuccess(validator.validate(new Date('2024-06-14'), ctx));
      expectFailure(validator.validate(new Date('2024-06-15'), ctx));
      expectFailure(validator.validate(new Date('2024-06-16'), ctx));
    });

    it('should validate date between range', () => {
      const minDate = new Date('2024-01-01');
      const maxDate = new Date('2024-12-31');
      const validator = compare<Date>().between(minDate, maxDate);

      expectSuccess(validator.validate(new Date('2024-06-15'), ctx));
      expectSuccess(validator.validate(new Date('2024-01-01'), ctx));
      expectSuccess(validator.validate(new Date('2024-12-31'), ctx));
      expectFailure(validator.validate(new Date('2023-12-31'), ctx));
      expectFailure(validator.validate(new Date('2025-01-01'), ctx));
    });
  });

  describe('Enum Comparisons', () => {
    it('should validate oneOf with string values', () => {
      const validator = compare<string>().oneOf(['active', 'inactive', 'pending']);

      expectSuccess(validator.validate('active', ctx));
      expectSuccess(validator.validate('inactive', ctx));
      expectSuccess(validator.validate('pending', ctx));
      expectFailure(validator.validate('deleted', ctx));
      expectFailure(validator.validate('', ctx));
    });

    it('should validate oneOf with number values', () => {
      const validator = compare<number>().oneOf([1, 2, 3, 5, 8]);

      expectSuccess(validator.validate(1, ctx));
      expectSuccess(validator.validate(5, ctx));
      expectFailure(validator.validate(4, ctx));
      expectFailure(validator.validate(0, ctx));
    });

    it('should validate with in() alias', () => {
      const validator = compare<string>().in(['red', 'green', 'blue']);

      expectSuccess(validator.validate('red', ctx));
      expectFailure(validator.validate('yellow', ctx));
    });

    it('should validate with enum() alias', () => {
      const validator = compare<string>().enum(['small', 'medium', 'large']);

      expectSuccess(validator.validate('medium', ctx));
      expectFailure(validator.validate('extra-large', ctx));
    });

    it('should validate notOneOf', () => {
      const validator = compare<string>().notOneOf(['admin', 'root', 'system']);

      expectSuccess(validator.validate('user', ctx));
      expectSuccess(validator.validate('guest', ctx));
      expectFailure(validator.validate('admin', ctx));
      expectFailure(validator.validate('root', ctx));
    });

    it('should validate with notIn() alias', () => {
      const validator = compare<number>().notIn([0, -1, -999]);

      expectSuccess(validator.validate(1, ctx));
      expectFailure(validator.validate(0, ctx));
      expectFailure(validator.validate(-1, ctx));
    });
  });

  describe('Cross-Field Comparisons', () => {
    it('should validate sameAs another field', () => {
      const validator = compare<string>().sameAs('password');

      const ctxWithPassword = createContext({
        data: { password: 'secret123' },
      });

      expectSuccess(validator.validate('secret123', ctxWithPassword));
      expectFailure(validator.validate('different', ctxWithPassword));
    });

    it('should validate with matches() alias', () => {
      const validator = compare<string>().matches('email');

      const ctxWithEmail = createContext({
        data: { email: 'user@example.com' },
      });

      expectSuccess(validator.validate('user@example.com', ctxWithEmail));
      expectFailure(validator.validate('other@example.com', ctxWithEmail));
    });

    it('should validate differentFrom another field', () => {
      const validator = compare<string>().differentFrom('username');

      const ctxWithUsername = createContext({
        data: { username: 'johndoe' },
      });

      expectSuccess(validator.validate('different', ctxWithUsername));
      expectFailure(validator.validate('johndoe', ctxWithUsername));
    });

    it('should validate with notSameAs() alias', () => {
      const validator = compare<string>().notSameAs('oldPassword');

      const ctxWithOldPassword = createContext({
        data: { oldPassword: 'old123' },
      });

      expectSuccess(validator.validate('new456', ctxWithOldPassword));
      expectFailure(validator.validate('old123', ctxWithOldPassword));
    });

    it('should validate with nested field paths', () => {
      const validator = compare<string>().sameAs('user.email');

      const ctxWithNestedData = createContext({
        data: { user: { email: 'user@example.com' } },
      });

      expectSuccess(validator.validate('user@example.com', ctxWithNestedData));
      expectFailure(validator.validate('other@example.com', ctxWithNestedData));
    });
  });

  describe('Literal Validator', () => {
    it('should validate string literal', () => {
      const validator = literal('SUCCESS');

      expectSuccess(validator.validate('SUCCESS', ctx));
      expectFailure(validator.validate('FAILURE' as any, ctx));
      expectFailure(validator.validate('success' as any, ctx)); // Case sensitive
    });

    it('should validate number literal', () => {
      const validator = literal(200);

      expectSuccess(validator.validate(200, ctx));
      expectFailure(validator.validate(404 as any, ctx));
      expectFailure(validator.validate(201 as any, ctx));
    });

    it('should validate boolean literal', () => {
      const trueValidator = literal(true);
      const falseValidator = literal(false);

      expectSuccess(trueValidator.validate(true, ctx));
      expectFailure(trueValidator.validate(false as any, ctx));

      expectSuccess(falseValidator.validate(false, ctx));
      expectFailure(falseValidator.validate(true as any, ctx));
    });
  });

  describe('Native Enum Validator', () => {
    it('should validate TypeScript enum', () => {
      enum Status {
        Active = 'active',
        Inactive = 'inactive',
        Pending = 'pending',
      }

      const validator = nativeEnum(Status);

      expectSuccess(validator.validate('active' as any, ctx));
      expectSuccess(validator.validate('inactive' as any, ctx));
      expectSuccess(validator.validate('pending' as any, ctx));
      expectFailure(validator.validate('deleted' as any, ctx));
    });

    it('should validate numeric enum', () => {
      enum Priority {
        Low = 1,
        Medium = 2,
        High = 3,
      }

      const validator = nativeEnum(Priority);

      expectSuccess(validator.validate(1 as any, ctx));
      expectSuccess(validator.validate(2 as any, ctx));
      expectSuccess(validator.validate(3 as any, ctx));
      expectFailure(validator.validate(0 as any, ctx));
      expectFailure(validator.validate(4 as any, ctx));
    });

    it('should validate const object as enum', () => {
      const Colors = {
        Red: 'red',
        Green: 'green',
        Blue: 'blue',
      } as const;

      const validator = nativeEnum(Colors);

      expectSuccess(validator.validate('red' as any, ctx));
      expectSuccess(validator.validate('green' as any, ctx));
      expectSuccess(validator.validate('blue' as any, ctx));
      expectFailure(validator.validate('yellow' as any, ctx));
    });
  });

  describe('Field Reference (ref)', () => {
    it('should create field reference', () => {
      const fieldRef = ref('password');

      expectSuccess(
        compare<string>()
          .equalTo(fieldRef)
          .validate('secret123', createContext({ data: { password: 'secret123' } })),
      );
    });

    it('should work with greaterThan', () => {
      const validator = compare<number>().greaterThan(ref('minValue'));

      expectSuccess(validator.validate(15, createContext({ data: { minValue: 10 } })));
      expectFailure(validator.validate(5, createContext({ data: { minValue: 10 } })));
    });

    it('should work with lessThan', () => {
      const validator = compare<number>().lessThan(ref('maxValue'));

      expectSuccess(validator.validate(5, createContext({ data: { maxValue: 10 } })));
      expectFailure(validator.validate(15, createContext({ data: { maxValue: 10 } })));
    });

    it('should work with between', () => {
      const validator = compare<number>().between(ref('min'), ref('max'));

      expectSuccess(validator.validate(50, createContext({ data: { min: 10, max: 100 } })));
      expectFailure(validator.validate(5, createContext({ data: { min: 10, max: 100 } })));
      expectFailure(validator.validate(150, createContext({ data: { min: 10, max: 100 } })));
    });
  });

  describe('Chaining Comparisons', () => {
    it('should chain multiple comparison validations', () => {
      const validator = compare<number>().greaterThan(0).lessThan(100).notEqualTo(50);

      expectSuccess(validator.validate(25, ctx));
      expectSuccess(validator.validate(75, ctx));
      expectFailure(validator.validate(0, ctx)); // Not greater than 0
      expectFailure(validator.validate(100, ctx)); // Not less than 100
      expectFailure(validator.validate(50, ctx)); // Equals forbidden value
      expectFailure(validator.validate(-10, ctx)); // Negative
    });

    it('should chain equality and enum validations', () => {
      const validator = compare<string>()
        .oneOf(['active', 'inactive', 'pending'])
        .notEqualTo('pending');

      expectSuccess(validator.validate('active', ctx));
      expectSuccess(validator.validate('inactive', ctx));
      expectFailure(validator.validate('pending', ctx)); // In list but forbidden
      expectFailure(validator.validate('deleted', ctx)); // Not in list
    });
  });

  describe('Real-world Scenarios', () => {
    it('should validate password confirmation', () => {
      const confirmPasswordValidator = compare<string>().sameAs('password');

      const passwordCtx = createContext({
        data: { password: 'SecurePass123!' },
      });

      expectSuccess(confirmPasswordValidator.validate('SecurePass123!', passwordCtx));
      expectFailure(confirmPasswordValidator.validate('DifferentPass', passwordCtx));
    });

    it('should validate age range for adult content', () => {
      const ageValidator = compare<number>().greaterThanOrEqual(18).lessThan(150);

      expectSuccess(ageValidator.validate(18, ctx));
      expectSuccess(ageValidator.validate(25, ctx));
      expectSuccess(ageValidator.validate(65, ctx));
      expectFailure(ageValidator.validate(17, ctx));
      expectFailure(ageValidator.validate(200, ctx));
    });

    it('should validate HTTP status codes', () => {
      const successStatusValidator = compare<number>().between(200, 299);

      expectSuccess(successStatusValidator.validate(200, ctx));
      expectSuccess(successStatusValidator.validate(201, ctx));
      expectSuccess(successStatusValidator.validate(204, ctx));
      expectFailure(successStatusValidator.validate(404, ctx));
      expectFailure(successStatusValidator.validate(500, ctx));
    });

    it('should validate user role restrictions', () => {
      const roleValidator = compare<string>()
        .oneOf(['user', 'admin', 'moderator', 'guest'])
        .notEqualTo('guest');

      expectSuccess(roleValidator.validate('user', ctx));
      expectSuccess(roleValidator.validate('admin', ctx));
      expectSuccess(roleValidator.validate('moderator', ctx));
      expectFailure(roleValidator.validate('guest', ctx)); // Forbidden
      expectFailure(roleValidator.validate('superadmin', ctx)); // Not in list
    });

    it('should validate price range', () => {
      const priceValidator = compare<number>().greaterThan(0).lessThanOrEqual(9999.99);

      expectSuccess(priceValidator.validate(19.99, ctx));
      expectSuccess(priceValidator.validate(1000, ctx));
      expectSuccess(priceValidator.validate(9999.99, ctx));
      expectFailure(priceValidator.validate(0, ctx));
      expectFailure(priceValidator.validate(-10, ctx));
      expectFailure(priceValidator.validate(10000, ctx));
    });

    it('should validate date range for event booking', () => {
      const today = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      const bookingDateValidator = compare<Date>().greaterThan(today).lessThan(oneYearFromNow);

      const validDate = new Date();
      validDate.setMonth(validDate.getMonth() + 3);

      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 1);

      const farFutureDate = new Date();
      farFutureDate.setFullYear(farFutureDate.getFullYear() + 2);

      expectSuccess(bookingDateValidator.validate(validDate, ctx));
      expectFailure(bookingDateValidator.validate(pastDate, ctx));
      expectFailure(bookingDateValidator.validate(farFutureDate, ctx));
    });

    it('should validate new password different from old', () => {
      const newPasswordValidator = compare<string>().differentFrom('oldPassword');

      const passwordCtx = createContext({
        data: { oldPassword: 'OldPass123' },
      });

      expectSuccess(newPasswordValidator.validate('NewPass456', passwordCtx));
      expectFailure(newPasswordValidator.validate('OldPass123', passwordCtx));
    });
  });
});
