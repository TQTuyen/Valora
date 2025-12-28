/**
 * Date Validator Tests
 */

import { describe, expect, it } from 'vitest';

import { date } from '@validators/date';
import { createContext, expectFailure, expectSuccess } from '../../helpers/test-utils';

describe('Date Validator', () => {
  const ctx = createContext();

  describe('Basic Date Validation', () => {
    it('should validate Date objects', () => {
      const validator = date();
      const now = new Date();

      expectSuccess(validator.validate(now, ctx));
    });

    it('should accept valid date strings', () => {
      const validator = date();

      expectSuccess(validator.validate('2024-01-01', ctx));
      expectSuccess(validator.validate('2024-06-15T12:00:00Z', ctx));
    });

    it('should accept timestamps', () => {
      const validator = date();

      expectSuccess(validator.validate(1234567890000, ctx));
      expectSuccess(validator.validate(Date.now(), ctx));
    });

    it('should reject invalid values', () => {
      const validator = date();

      expectFailure(validator.validate(null as unknown as Date, ctx));
      expectFailure(validator.validate(undefined as unknown as Date, ctx));
      expectFailure(validator.validate('invalid-date', ctx));
      expectFailure(validator.validate({} as unknown as Date, ctx));
    });

    it('should reject invalid dates', () => {
      const validator = date();
      const invalidDate = new Date('invalid');

      expectFailure(validator.validate(invalidDate, ctx));
    });
  });

  describe('Date Range Validation', () => {
    it('should validate minimum date', () => {
      const minDate = new Date('2024-01-01');
      const validator = date().min(minDate);

      expectSuccess(validator.validate(new Date('2024-01-01'), ctx)); // Equal to min
      expectSuccess(validator.validate(new Date('2024-06-15'), ctx)); // After min
      expectFailure(validator.validate(new Date('2023-12-31'), ctx)); // Before min
    });

    it('should validate maximum date', () => {
      const maxDate = new Date('2024-12-31');
      const validator = date().max(maxDate);

      expectSuccess(validator.validate(new Date('2024-12-31'), ctx)); // Equal to max
      expectSuccess(validator.validate(new Date('2024-06-15'), ctx)); // Before max
      expectFailure(validator.validate(new Date('2025-01-01'), ctx)); // After max
    });

    it('should validate date range', () => {
      const minDate = new Date('2024-01-01');
      const maxDate = new Date('2024-12-31');
      const validator = date().min(minDate).max(maxDate);

      expectSuccess(validator.validate(new Date('2024-06-15'), ctx)); // Within range
      expectSuccess(validator.validate(new Date('2024-01-01'), ctx)); // At min boundary
      expectSuccess(validator.validate(new Date('2024-12-31'), ctx)); // At max boundary
      expectFailure(validator.validate(new Date('2023-12-31'), ctx)); // Before range
      expectFailure(validator.validate(new Date('2025-01-01'), ctx)); // After range
    });
  });

  describe('Date Comparison Validation', () => {
    it('should validate dates before a reference date', () => {
      const refDate = new Date('2024-06-15');
      const validator = date().isBefore(refDate);

      expectSuccess(validator.validate(new Date('2024-06-14'), ctx));
      expectSuccess(validator.validate(new Date('2024-01-01'), ctx));
      expectFailure(validator.validate(new Date('2024-06-15'), ctx)); // Equal
      expectFailure(validator.validate(new Date('2024-06-16'), ctx)); // After
    });

    it('should validate dates after a reference date', () => {
      const refDate = new Date('2024-06-15');
      const validator = date().isAfter(refDate);

      expectSuccess(validator.validate(new Date('2024-06-16'), ctx));
      expectSuccess(validator.validate(new Date('2024-12-31'), ctx));
      expectFailure(validator.validate(new Date('2024-06-15'), ctx)); // Equal
      expectFailure(validator.validate(new Date('2024-06-14'), ctx)); // Before
    });
  });

  describe('Special Date Validation', () => {
    it('should validate today', () => {
      const validator = date().isToday();
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expectSuccess(validator.validate(today, ctx));
      expectFailure(validator.validate(yesterday, ctx));
      expectFailure(validator.validate(tomorrow, ctx));
    });

    it('should validate past dates', () => {
      const validator = date().isPast();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expectSuccess(validator.validate(yesterday, ctx));
      expectSuccess(validator.validate(new Date('2020-01-01'), ctx));
      expectFailure(validator.validate(tomorrow, ctx));
    });

    it('should validate future dates', () => {
      const validator = date().isFuture();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      expectSuccess(validator.validate(tomorrow, ctx));
      expectSuccess(validator.validate(new Date('2030-01-01'), ctx));
      expectFailure(validator.validate(yesterday, ctx));
    });
  });

  describe('Age Validation', () => {
    it('should validate minimum age', () => {
      const validator = date().minAge(18);

      // 18 years ago
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

      // 17 years ago
      const seventeenYearsAgo = new Date();
      seventeenYearsAgo.setFullYear(seventeenYearsAgo.getFullYear() - 17);

      // 20 years ago
      const twentyYearsAgo = new Date();
      twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);

      expectSuccess(validator.validate(eighteenYearsAgo, ctx)); // Exactly 18
      expectSuccess(validator.validate(twentyYearsAgo, ctx)); // Older than 18
      expectFailure(validator.validate(seventeenYearsAgo, ctx)); // Younger than 18
    });

    it('should validate maximum age', () => {
      const validator = date().maxAge(65);

      // 65 years ago
      const sixtyFiveYearsAgo = new Date();
      sixtyFiveYearsAgo.setFullYear(sixtyFiveYearsAgo.getFullYear() - 65);

      // 70 years ago
      const seventyYearsAgo = new Date();
      seventyYearsAgo.setFullYear(seventyYearsAgo.getFullYear() - 70);

      // 60 years ago
      const sixtyYearsAgo = new Date();
      sixtyYearsAgo.setFullYear(sixtyYearsAgo.getFullYear() - 60);

      expectSuccess(validator.validate(sixtyFiveYearsAgo, ctx)); // Exactly 65
      expectSuccess(validator.validate(sixtyYearsAgo, ctx)); // Younger than 65
      expectFailure(validator.validate(seventyYearsAgo, ctx)); // Older than 65
    });

    it('should validate age range', () => {
      const validator = date().minAge(18).maxAge(65);

      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

      const thirtyYearsAgo = new Date();
      thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);

      const sixtyFiveYearsAgo = new Date();
      sixtyFiveYearsAgo.setFullYear(sixtyFiveYearsAgo.getFullYear() - 65);

      const seventeenYearsAgo = new Date();
      seventeenYearsAgo.setFullYear(seventeenYearsAgo.getFullYear() - 17);

      const seventyYearsAgo = new Date();
      seventyYearsAgo.setFullYear(seventyYearsAgo.getFullYear() - 70);

      expectSuccess(validator.validate(eighteenYearsAgo, ctx)); // At min boundary
      expectSuccess(validator.validate(thirtyYearsAgo, ctx)); // Within range
      expectSuccess(validator.validate(sixtyFiveYearsAgo, ctx)); // At max boundary
      expectFailure(validator.validate(seventeenYearsAgo, ctx)); // Too young
      expectFailure(validator.validate(seventyYearsAgo, ctx)); // Too old
    });
  });

  describe('Weekday/Weekend Validation', () => {
    it('should validate weekdays', () => {
      const validator = date().isWeekday();

      // Monday (2024-01-01 was a Monday)
      const monday = new Date('2024-01-01');
      expectSuccess(validator.validate(monday, ctx));

      // Friday (2024-01-05 was a Friday)
      const friday = new Date('2024-01-05');
      expectSuccess(validator.validate(friday, ctx));

      // Saturday (2024-01-06 was a Saturday)
      const saturday = new Date('2024-01-06');
      expectFailure(validator.validate(saturday, ctx));

      // Sunday (2024-01-07 was a Sunday)
      const sunday = new Date('2024-01-07');
      expectFailure(validator.validate(sunday, ctx));
    });

    it('should validate weekends', () => {
      const validator = date().isWeekend();

      // Saturday (2024-01-06 was a Saturday)
      const saturday = new Date('2024-01-06');
      expectSuccess(validator.validate(saturday, ctx));

      // Sunday (2024-01-07 was a Sunday)
      const sunday = new Date('2024-01-07');
      expectSuccess(validator.validate(sunday, ctx));

      // Monday (2024-01-01 was a Monday)
      const monday = new Date('2024-01-01');
      expectFailure(validator.validate(monday, ctx));

      // Friday (2024-01-05 was a Friday)
      const friday = new Date('2024-01-05');
      expectFailure(validator.validate(friday, ctx));
    });
  });

  describe('Optional and Nullable', () => {
    it('should handle optional dates', () => {
      const validator = date().optional();

      expectSuccess(validator.validate(undefined, ctx));
      expectSuccess(validator.validate(new Date(), ctx));
    });

    it('should handle nullable dates', () => {
      const validator = date().nullable();

      expectSuccess(validator.validate(null, ctx));
      expectSuccess(validator.validate(new Date(), ctx));
    });
  });

  describe('Transform', () => {
    it('should transform date values', () => {
      const validator = date().transform((val) => val.toISOString());

      const testDate = new Date('2024-06-15T12:00:00Z');
      const result = validator.validate(testDate, ctx);

      expectSuccess(result);
      expect(result.success && result.data).toBe('2024-06-15T12:00:00.000Z');
    });
  });

  describe('Default Values', () => {
    it('should provide default value for undefined', () => {
      const defaultDate = new Date('2024-01-01');
      const validator = date().default(defaultDate);

      expectSuccess(validator.validate(undefined, ctx), defaultDate);
      expectSuccess(validator.validate(null, ctx), defaultDate);

      const customDate = new Date('2024-06-15');
      expectSuccess(validator.validate(customDate, ctx), customDate);
    });
  });

  describe('Chaining Validations', () => {
    it('should chain multiple date validations', () => {
      const minDate = new Date('2024-01-01');
      const maxDate = new Date('2024-12-31');
      const validator = date().min(minDate).max(maxDate).isWeekday();

      // Valid: weekday within range
      const validDate = new Date('2024-06-03'); // Monday
      expectSuccess(validator.validate(validDate, ctx));

      // Invalid: weekend
      const weekend = new Date('2024-06-01'); // Saturday
      expectFailure(validator.validate(weekend, ctx));

      // Invalid: before range
      const beforeRange = new Date('2023-06-05'); // Monday but before range
      expectFailure(validator.validate(beforeRange, ctx));
    });

    it('should chain age and date range validations', () => {
      const minDate = new Date('1960-01-01');
      const maxDate = new Date('2005-12-31');
      const validator = date().min(minDate).max(maxDate).minAge(18).maxAge(65);

      // Valid: within date range and age range
      const thirtyYearsAgo = new Date();
      thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);
      expectSuccess(validator.validate(thirtyYearsAgo, ctx));

      // Invalid: too young
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
      expectFailure(validator.validate(tenYearsAgo, ctx));
    });
  });

  describe('Real-world Scenarios', () => {
    it('should validate birth date for adult registration', () => {
      const validator = date().isPast().minAge(18);

      const validBirthDate = new Date();
      validBirthDate.setFullYear(validBirthDate.getFullYear() - 25);
      expectSuccess(validator.validate(validBirthDate, ctx));

      const minorBirthDate = new Date();
      minorBirthDate.setFullYear(minorBirthDate.getFullYear() - 15);
      expectFailure(validator.validate(minorBirthDate, ctx));

      const futureBirthDate = new Date();
      futureBirthDate.setFullYear(futureBirthDate.getFullYear() + 1);
      expectFailure(validator.validate(futureBirthDate, ctx));
    });

    it('should validate event date', () => {
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      const validator = date().isFuture().max(oneYearFromNow);

      const validEventDate = new Date();
      validEventDate.setMonth(validEventDate.getMonth() + 3);
      expectSuccess(validator.validate(validEventDate, ctx));

      const pastEventDate = new Date();
      pastEventDate.setMonth(pastEventDate.getMonth() - 1);
      expectFailure(validator.validate(pastEventDate, ctx));

      const tooFarFutureDate = new Date();
      tooFarFutureDate.setFullYear(tooFarFutureDate.getFullYear() + 2);
      expectFailure(validator.validate(tooFarFutureDate, ctx));
    });

    it('should validate appointment date (weekdays only, future)', () => {
      const validator = date().isFuture().isWeekday();

      // Find next Monday
      const nextMonday = new Date();
      nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));

      expectSuccess(validator.validate(nextMonday, ctx));

      // Find next Saturday
      const nextSaturday = new Date();
      nextSaturday.setDate(nextSaturday.getDate() + ((6 + 7 - nextSaturday.getDay()) % 7 || 7));

      expectFailure(validator.validate(nextSaturday, ctx));
    });
  });
});
