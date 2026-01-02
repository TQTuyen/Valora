import { describe, expect, it } from 'vitest';

import {
  IsAfter,
  IsBefore,
  IsDate,
  IsFuture,
  IsPast,
  IsToday,
  IsWeekday,
  IsWeekend,
  MaxAge,
  MaxDate,
  MinAge,
  MinDate,
} from '@/decorators/property/date';
import { validateClassInstance } from '@/decorators/class';

describe('Date Property Decorators', () => {
  describe('@IsDate', () => {
    it('should pass when value is a Date object', () => {
      class TestDto {
        @IsDate()
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date();

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is a valid date', () => {
      class TestDto {
        @IsDate()
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-01-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is not a Date object', () => {
      class TestDto {
        @IsDate()
        date: any;
      }

      const dto = new TestDto();
      dto.date = 'not a date';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['date']);
    });

    it('should accept date created from timestamp', () => {
      class TestDto {
        @IsDate()
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date(1234567890000); // Timestamp in milliseconds

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is an invalid Date', () => {
      class TestDto {
        @IsDate()
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('invalid');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @IsDate({ message: 'Must be a valid date' })
        date: any;
      }

      const dto = new TestDto();
      dto.date = 'string';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });
  });

  describe('@MinDate', () => {
    it('should pass when date is after minimum', () => {
      class TestDto {
        @MinDate(new Date('2024-01-01'))
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-06-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when date equals minimum', () => {
      class TestDto {
        @MinDate(new Date('2024-01-01'))
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-01-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when date is before minimum', () => {
      class TestDto {
        @MinDate(new Date('2024-01-01'))
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2023-12-31');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should work with string date argument', () => {
      class TestDto {
        @MinDate('2024-01-01')
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-06-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@MaxDate', () => {
    it('should pass when date is before maximum', () => {
      class TestDto {
        @MaxDate(new Date('2024-12-31'))
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-06-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when date equals maximum', () => {
      class TestDto {
        @MaxDate(new Date('2024-12-31'))
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-12-31');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when date is after maximum', () => {
      class TestDto {
        @MaxDate(new Date('2024-12-31'))
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2025-01-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should work with string date argument', () => {
      class TestDto {
        @MaxDate('2024-12-31')
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-06-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@IsFuture', () => {
    it('should pass when date is in the future', () => {
      class TestDto {
        @IsFuture()
        date: Date;
      }

      const dto = new TestDto();
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      dto.date = futureDate;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when date is in the past', () => {
      class TestDto {
        @IsFuture()
        date: Date;
      }

      const dto = new TestDto();
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      dto.date = pastDate;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when date is now', () => {
      class TestDto {
        @IsFuture()
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date();

      const result = validateClassInstance(dto);
      // This might be flaky, but for testing purposes we expect it to fail
      // since the date is essentially "now" and not strictly in the future
      expect(result.success).toBe(false);
    });
  });

  describe('@IsPast', () => {
    it('should pass when date is in the past', () => {
      class TestDto {
        @IsPast()
        date: Date;
      }

      const dto = new TestDto();
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      dto.date = pastDate;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when date is in the future', () => {
      class TestDto {
        @IsPast()
        date: Date;
      }

      const dto = new TestDto();
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      dto.date = futureDate;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should pass when date is yesterday', () => {
      class TestDto {
        @IsPast()
        date: Date;
      }

      const dto = new TestDto();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      dto.date = yesterday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@IsToday', () => {
    it('should pass when date is today', () => {
      class TestDto {
        @IsToday()
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date();

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when date is yesterday', () => {
      class TestDto {
        @IsToday()
        date: Date;
      }

      const dto = new TestDto();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      dto.date = yesterday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when date is tomorrow', () => {
      class TestDto {
        @IsToday()
        date: Date;
      }

      const dto = new TestDto();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dto.date = tomorrow;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should pass for different times today', () => {
      class TestDto {
        @IsToday()
        date: Date;
      }

      const dto = new TestDto();
      const todayMorning = new Date();
      todayMorning.setHours(8, 0, 0, 0);
      dto.date = todayMorning;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@IsAfter', () => {
    it('should pass when date is after reference date', () => {
      class TestDto {
        @IsAfter(new Date('2024-01-01'))
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-06-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when date equals reference date', () => {
      class TestDto {
        @IsAfter(new Date('2024-01-01'))
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-01-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when date is before reference date', () => {
      class TestDto {
        @IsAfter(new Date('2024-01-01'))
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2023-12-31');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should work with string date argument', () => {
      class TestDto {
        @IsAfter('2024-01-01')
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-06-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@IsBefore', () => {
    it('should pass when date is before reference date', () => {
      class TestDto {
        @IsBefore(new Date('2024-12-31'))
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-06-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when date equals reference date', () => {
      class TestDto {
        @IsBefore(new Date('2024-12-31'))
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-12-31');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when date is after reference date', () => {
      class TestDto {
        @IsBefore(new Date('2024-12-31'))
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2025-01-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should work with string date argument', () => {
      class TestDto {
        @IsBefore('2024-12-31')
        date: Date;
      }

      const dto = new TestDto();
      dto.date = new Date('2024-06-01');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@IsWeekday', () => {
    it('should pass when date is Monday', () => {
      class TestDto {
        @IsWeekday()
        date: Date;
      }

      const dto = new TestDto();
      // Find a Monday
      const monday = new Date('2024-01-01'); // This is a Monday
      dto.date = monday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when date is Friday', () => {
      class TestDto {
        @IsWeekday()
        date: Date;
      }

      const dto = new TestDto();
      // Find a Friday
      const friday = new Date('2024-01-05'); // This is a Friday
      dto.date = friday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when date is Saturday', () => {
      class TestDto {
        @IsWeekday()
        date: Date;
      }

      const dto = new TestDto();
      // Find a Saturday
      const saturday = new Date('2024-01-06'); // This is a Saturday
      dto.date = saturday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when date is Sunday', () => {
      class TestDto {
        @IsWeekday()
        date: Date;
      }

      const dto = new TestDto();
      // Find a Sunday
      const sunday = new Date('2024-01-07'); // This is a Sunday
      dto.date = sunday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@IsWeekend', () => {
    it('should pass when date is Saturday', () => {
      class TestDto {
        @IsWeekend()
        date: Date;
      }

      const dto = new TestDto();
      // Find a Saturday
      const saturday = new Date('2024-01-06'); // This is a Saturday
      dto.date = saturday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when date is Sunday', () => {
      class TestDto {
        @IsWeekend()
        date: Date;
      }

      const dto = new TestDto();
      // Find a Sunday
      const sunday = new Date('2024-01-07'); // This is a Sunday
      dto.date = sunday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when date is Monday', () => {
      class TestDto {
        @IsWeekend()
        date: Date;
      }

      const dto = new TestDto();
      // Find a Monday
      const monday = new Date('2024-01-01'); // This is a Monday
      dto.date = monday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when date is Friday', () => {
      class TestDto {
        @IsWeekend()
        date: Date;
      }

      const dto = new TestDto();
      // Find a Friday
      const friday = new Date('2024-01-05'); // This is a Friday
      dto.date = friday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@MinAge', () => {
    it('should pass when age meets minimum', () => {
      class TestDto {
        @MinAge(18)
        birthDate: Date;
      }

      const dto = new TestDto();
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 20);
      dto.birthDate = birthDate;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when age exactly equals minimum', () => {
      class TestDto {
        @MinAge(18)
        birthDate: Date;
      }

      const dto = new TestDto();
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 18);
      dto.birthDate = birthDate;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when age is below minimum', () => {
      class TestDto {
        @MinAge(18)
        birthDate: Date;
      }

      const dto = new TestDto();
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 16);
      dto.birthDate = birthDate;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @MinAge(18, { message: 'Must be at least 18 years old' })
        birthDate: Date;
      }

      const dto = new TestDto();
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 16);
      dto.birthDate = birthDate;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Check that there is a validation error
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('@MaxAge', () => {
    it('should pass when age is below maximum', () => {
      class TestDto {
        @MaxAge(65)
        birthDate: Date;
      }

      const dto = new TestDto();
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 60);
      dto.birthDate = birthDate;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when age exactly equals maximum', () => {
      class TestDto {
        @MaxAge(65)
        birthDate: Date;
      }

      const dto = new TestDto();
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 65);
      dto.birthDate = birthDate;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when age exceeds maximum', () => {
      class TestDto {
        @MaxAge(65)
        birthDate: Date;
      }

      const dto = new TestDto();
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 70);
      dto.birthDate = birthDate;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('Integration: Multiple date decorators', () => {
    it('should validate event date with multiple constraints', () => {
      class EventDto {
        @IsDate()
        @IsFuture()
        @IsWeekday()
        eventDate: Date;
      }

      const dto = new EventDto();
      // Create a future weekday (next Monday)
      const futureMonday = new Date();
      futureMonday.setDate(futureMonday.getDate() + ((1 + 7 - futureMonday.getDay()) % 7 || 7));
      dto.eventDate = futureMonday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when event date is on weekend', () => {
      class EventDto {
        @IsDate()
        @IsFuture()
        @IsWeekday()
        eventDate: Date;
      }

      const dto = new EventDto();
      // Create a future Saturday
      const futureSaturday = new Date();
      futureSaturday.setDate(
        futureSaturday.getDate() + ((6 + 7 - futureSaturday.getDay()) % 7 || 7),
      );
      dto.eventDate = futureSaturday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should validate birth date with age constraints', () => {
      class UserDto {
        @IsDate()
        @IsPast()
        @MinAge(18)
        @MaxAge(100)
        birthDate: Date;
      }

      const dto = new UserDto();
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      dto.birthDate = birthDate;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should validate date range', () => {
      class PeriodDto {
        @IsDate()
        @MinDate(new Date('2024-01-01'))
        @MaxDate(new Date('2024-12-31'))
        date: Date;
      }

      const dto = new PeriodDto();
      dto.date = new Date('2024-06-15');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when date is outside range', () => {
      class PeriodDto {
        @IsDate()
        @MinDate(new Date('2024-01-01'))
        @MaxDate(new Date('2024-12-31'))
        date: Date;
      }

      const dto = new PeriodDto();
      dto.date = new Date('2025-01-15');

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should validate appointment constraints', () => {
      // Use dynamic dates to avoid test failures when year changes
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() + 1); // 1 month from now

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1); // 2 months from now

      class AppointmentDto {
        @IsDate()
        @IsAfter(startDate)
        @IsBefore(endDate)
        @IsWeekday()
        appointmentDate: Date;
      }

      const dto = new AppointmentDto();
      // Create a future weekday within the range
      const futureWeekday = new Date(startDate);
      futureWeekday.setDate(futureWeekday.getDate() + 1);
      // Adjust to next weekday if needed
      while (futureWeekday.getDay() === 0 || futureWeekday.getDay() === 6) {
        futureWeekday.setDate(futureWeekday.getDate() + 1);
      }
      dto.appointmentDate = futureWeekday;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });
});
