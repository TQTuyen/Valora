/**
 * SSN Strategy
 * @module validators/business/strategies/ssn
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * SSN validation strategy
 *
 * Validates U.S. Social Security Numbers.
 * Format: XXX-XX-XXXX or XXXXXXXXX
 */
export class SSNStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'ssn';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    // Remove hyphens
    const normalized = value.replace(/-/g, '');

    // Must be exactly 9 digits
    if (!/^\d{9}$/.test(normalized)) {
      return this.failure('business.ssn.format', context);
    }

    // Extract parts
    const area = normalized.slice(0, 3);
    const group = normalized.slice(3, 5);
    const serial = normalized.slice(5, 9);

    // Validate area number (first 3 digits)
    // Cannot be 000, 666, or 900-999
    const areaNum = parseInt(area, 10);
    if (areaNum === 0 || areaNum === 666 || areaNum >= 900) {
      return this.failure('business.ssn.area', context);
    }

    // Validate group number (middle 2 digits)
    // Cannot be 00
    if (group === '00') {
      return this.failure('business.ssn.group', context);
    }

    // Validate serial number (last 4 digits)
    // Cannot be 0000
    if (serial === '0000') {
      return this.failure('business.ssn.serial', context);
    }

    // Check for known invalid patterns
    if (this.isKnownInvalid(normalized)) {
      return this.failure('business.ssn.invalid', context);
    }

    return this.success(value, context);
  }

  /**
   * Check for known invalid SSN patterns
   */
  private isKnownInvalid(ssn: string): boolean {
    const invalidPatterns = [
      '123456789', // Sequential
      '111111111', // Repeated digit
      '222222222',
      '333333333',
      '444444444',
      '555555555',
      '777777777',
      '888888888',
      '999999999',
      '078051120', // Woolworth's wallet card SSN
    ];

    return invalidPatterns.includes(ssn);
  }
}
