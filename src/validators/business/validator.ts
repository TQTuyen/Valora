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
   */
  creditCard(allowedTypes?: CreditCardType[]): this {
    return this.addStrategy(new CreditCardStrategy(allowedTypes));
  }

  /**
   * Validate phone number
   * @param options - Phone validation options
   */
  phone(options?: { countryCode?: string; allowExtension?: boolean }): this {
    return this.addStrategy(new PhoneStrategy(options));
  }

  /**
   * Validate IBAN (International Bank Account Number)
   * @param allowedCountries - Optional array of allowed country codes
   */
  iban(allowedCountries?: string[]): this {
    return this.addStrategy(new IBANStrategy(allowedCountries));
  }

  /**
   * Validate SSN (U.S. Social Security Number)
   */
  ssn(): this {
    return this.addStrategy(new SSNStrategy());
  }

  /**
   * Validate URL slug
   * @param options - Slug validation options
   */
  slug(options?: { minLength?: number; maxLength?: number; allowUnderscores?: boolean }): this {
    return this.addStrategy(new UrlSlugStrategy(options));
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
