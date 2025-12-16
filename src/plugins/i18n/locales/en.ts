/**
 * English locale messages
 * @module plugins/i18n/locales/en
 */

import type { LocaleMessages } from '#types/index';

export const enMessages: LocaleMessages = {
  // String validators
  string: {
    type: 'Must be a string',
    required: 'This field is required',
    empty: 'This field cannot be empty',
    email: 'Must be a valid email address',
    url: 'Must be a valid URL',
    uuid: 'Must be a valid UUID',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be at most {max} characters',
    length: 'Must be exactly {length} characters',
    pattern: 'Invalid format',
    matches: 'Does not match the required pattern',
    startsWith: 'Must start with "{prefix}"',
    endsWith: 'Must end with "{suffix}"',
    contains: 'Must contain "{substring}"',
    alpha: 'Must contain only letters',
    alphanumeric: 'Must contain only letters and numbers',
    numeric: 'Must contain only numbers',
    lowercase: 'Must be lowercase',
    uppercase: 'Must be uppercase',
    trim: 'Must not have leading or trailing whitespace',
    notEmpty: 'Cannot be empty or whitespace only',
  },

  // Number validators
  number: {
    type: 'Must be a number',
    required: 'This field is required',
    min: 'Must be at least {min}',
    max: 'Must be at most {max}',
    range: 'Must be between {min} and {max}',
    integer: 'Must be an integer',
    positive: 'Must be a positive number',
    negative: 'Must be a negative number',
    nonPositive: 'Must be zero or a negative number',
    nonNegative: 'Must be zero or a positive number',
    multipleOf: 'Must be a multiple of {factor}',
    finite: 'Must be a finite number',
    safe: 'Must be a safe integer',
  },

  // Boolean validators
  boolean: {
    type: 'Must be a boolean',
    required: 'This field is required',
    isTrue: 'Must be true',
    isFalse: 'Must be false',
  },

  // Date validators
  date: {
    type: 'Must be a valid date',
    required: 'This field is required',
    invalid: 'Invalid date',
    min: 'Must be after {date}',
    max: 'Must be before {date}',
    minDate: 'Must be on or after {date}',
    maxDate: 'Must be on or before {date}',
    isBefore: 'Must be before {date}',
    isAfter: 'Must be after {date}',
    past: 'Must be a past date',
    future: 'Must be a future date',
  },

  // Array validators
  array: {
    type: 'Must be an array',
    required: 'This field is required',
    minItems: 'Must have at least {min} items',
    maxItems: 'Must have at most {max} items',
    length: 'Must have exactly {length} items',
    unique: 'All items must be unique',
    includes: 'Must include {value}',
    notEmpty: 'Cannot be an empty array',
    item: 'Item at index {index} is invalid',
  },

  // Object validators
  object: {
    type: 'Must be an object',
    required: 'This field is required',
    unknown: 'Unknown field: {field}',
    missing: 'Missing required field: {field}',
    shape: 'Object does not match the expected shape',
    notEmpty: 'Cannot be an empty object',
  },

  // Logic validators
  logic: {
    and: 'All conditions must be met',
    or: 'At least one condition must be met',
    not: 'Condition must not be met',
    xor: 'Exactly one condition must be met',
    if: 'Conditional validation failed',
  },

  // Comparison validators
  comparison: {
    equals: 'Must equal {expected}',
    notEquals: 'Must not equal {expected}',
    oneOf: 'Must be one of: {values}',
    notOneOf: 'Must not be one of: {values}',
    sameAs: 'Must match {field}',
    differentFrom: 'Must be different from {field}',
  },

  // Common/Generic
  common: {
    required: 'This field is required',
    optional: 'This field is optional',
    invalid: 'Invalid value',
    unknown: 'Unknown validation error',
    custom: 'Validation failed',
    transform: 'Transformation failed',
  },

  // File validators
  file: {
    type: 'Must be a file',
    required: 'File is required',
    size: 'File size must be at most {max}',
    minSize: 'File size must be at least {min}',
    mimeType: 'File type must be one of: {types}',
    extension: 'File extension must be one of: {extensions}',
  },

  // Business validators
  business: {
    creditCard: 'Must be a valid credit card number',
    phone: 'Must be a valid phone number',
    postalCode: 'Must be a valid postal code',
    ssn: 'Must be a valid SSN',
    ein: 'Must be a valid EIN',
    iban: 'Must be a valid IBAN',
    swift: 'Must be a valid SWIFT code',
    vatId: 'Must be a valid VAT ID',
  },
};
