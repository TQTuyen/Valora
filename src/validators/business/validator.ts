/**
 * Business Validator
 * @module validators/business/validator
 */

import { StringValidator } from '@validators/string';

import {
  CreditCardStrategy,
  IBANStrategy,
  PhoneStrategy,
  SSNStrategy,
  UrlSlugStrategy,
} from './strategies';

import type { CreditCardType } from './strategies';
import type { ValidationOptions } from '#types/index';

/**
 * Business validator for domain-specific validation rules
 *
 * Extends StringValidator with business-specific validation strategies
 * like credit cards, phone numbers, IBANs, etc.
 *
 * @example
 * ```typescript
 * const cardValidator = business().creditCard(['visa', 'mastercard']);
 * const phoneValidator = business().phone({ countryCode: 'US' });
 * const ibanValidator = business().iban(['US', 'GB']);
 * ```
 */
export class BusinessValidator extends StringValidator {
  override readonly _type: string = 'business';

  /**
   * Validate credit card number
   * @param allowedTypes - Optional array of allowed card types
   * @param options - Optional validation options
   */
  creditCard(allowedTypes?: CreditCardType[], options?: ValidationOptions): this {
    return this.addStrategy(new CreditCardStrategy(allowedTypes, options));
  }

  /**
   * Validate phone number
   * @param phoneOptions - Phone validation options
   * @param options - Optional validation options
   */
  phone(
    phoneOptions?: { countryCode?: string; allowExtension?: boolean },
    options?: ValidationOptions,
  ): this {
    return this.addStrategy(new PhoneStrategy(phoneOptions, options));
  }

  /**
   * Validate IBAN (International Bank Account Number)
   * @param allowedCountries - Optional array of allowed country codes
   * @param options - Optional validation options
   */
  iban(allowedCountries?: string[], options?: ValidationOptions): this {
    return this.addStrategy(new IBANStrategy(allowedCountries, options));
  }

  /**
   * Validate SSN (U.S. Social Security Number)
   * @param options - Optional validation options
   */
  ssn(options?: ValidationOptions): this {
    return this.addStrategy(new SSNStrategy(options));
  }

  /**
   * Validate URL slug
   * @param slugOptions - Slug validation options
   * @param options - Optional validation options
   */
  slug(
    slugOptions?: { minLength?: number; maxLength?: number; allowUnderscores?: boolean },
    options?: ValidationOptions,
  ): this {
    return this.addStrategy(new UrlSlugStrategy(slugOptions, options));
  }
}

/**
 * Create a business validator
 *
 * @example
 * ```typescript
 * const validator = business()
 *   .creditCard(['visa', 'mastercard'])
 *   .minLength(13);
 *
 * const result = validator.validate('4111111111111111', context);
 * ```
 */
export function business(): BusinessValidator {
  return new BusinessValidator();
}
