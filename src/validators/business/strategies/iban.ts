/**
 * IBAN Strategy
 * @module validators/business/strategies/iban
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * IBAN length by country code
 */
const IBAN_LENGTHS: Record<string, number> = {
  AD: 24,
  AE: 23,
  AL: 28,
  AT: 20,
  AZ: 28,
  BA: 20,
  BE: 16,
  BG: 22,
  BH: 22,
  BR: 29,
  BY: 28,
  CH: 21,
  CR: 22,
  CY: 28,
  CZ: 24,
  DE: 22,
  DK: 18,
  DO: 28,
  EE: 20,
  EG: 29,
  ES: 24,
  FI: 18,
  FO: 18,
  FR: 27,
  GB: 22,
  GE: 22,
  GI: 23,
  GL: 18,
  GR: 27,
  GT: 28,
  HR: 21,
  HU: 28,
  IE: 22,
  IL: 23,
  IS: 26,
  IT: 27,
  JO: 30,
  KW: 30,
  KZ: 20,
  LB: 28,
  LC: 32,
  LI: 21,
  LT: 20,
  LU: 20,
  LV: 21,
  MC: 27,
  MD: 24,
  ME: 22,
  MK: 19,
  MR: 27,
  MT: 31,
  MU: 30,
  NL: 18,
  NO: 15,
  PK: 24,
  PL: 28,
  PS: 29,
  PT: 25,
  QA: 29,
  RO: 24,
  RS: 22,
  SA: 24,
  SE: 24,
  SI: 19,
  SK: 24,
  SM: 27,
  TN: 24,
  TR: 26,
  UA: 29,
  VA: 22,
  VG: 24,
  XK: 20,
};

/**
 * IBAN validation strategy
 *
 * Validates International Bank Account Numbers using the mod-97 algorithm.
 */
export class IBANStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'iban';

  constructor(private readonly allowedCountries?: string[]) {
    super();
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    // Remove spaces and convert to uppercase
    const normalized = value.replace(/\s/g, '').toUpperCase();

    // Basic format check: 2 letters + 2 digits + up to 30 alphanumeric
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(normalized)) {
      return this.failure('business.iban.format', context);
    }

    // Extract country code
    const countryCode = normalized.slice(0, 2);

    // Check country code is valid
    if (!IBAN_LENGTHS[countryCode]) {
      return this.failure('business.iban.country', context, { countryCode });
    }

    // Check if country is allowed
    if (this.allowedCountries && !this.allowedCountries.includes(countryCode)) {
      return this.failure('business.iban.countryNotAllowed', context, {
        countryCode,
        allowedCountries: this.allowedCountries,
      });
    }

    // Check length for country
    if (normalized.length !== IBAN_LENGTHS[countryCode]) {
      return this.failure('business.iban.length', context, {
        expected: IBAN_LENGTHS[countryCode],
        actual: normalized.length,
      });
    }

    // Validate checksum using mod-97 algorithm
    if (!this.validateChecksum(normalized)) {
      return this.failure('business.iban.checksum', context);
    }

    return this.success(value, context);
  }

  /**
   * Validate IBAN checksum using mod-97 algorithm
   */
  private validateChecksum(iban: string): boolean {
    // Move first 4 characters to end
    const rearranged = iban.slice(4) + iban.slice(0, 4);

    // Replace letters with numbers (A=10, B=11, ..., Z=35)
    const numeric = rearranged.replace(/[A-Z]/g, (char) => {
      return String(char.charCodeAt(0) - 55);
    });

    // Calculate mod 97
    return this.mod97(numeric) === 1;
  }

  /**
   * Calculate mod 97 for large numbers (as string)
   */
  private mod97(numericString: string): number {
    let remainder = 0;

    for (let i = 0; i < numericString.length; i++) {
      remainder = (remainder * 10 + parseInt(numericString[i] ?? '0', 10)) % 97;
    }

    return remainder;
  }
}
