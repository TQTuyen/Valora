/**
 * Test Fixtures
 * Common test data for validators
 */

/**
 * Valid email addresses
 */
export const VALID_EMAILS = [
  'test@example.com',
  'user.name@example.co.uk',
  'first+last@test-domain.com',
  'email@subdomain.example.com',
];

/**
 * Invalid email addresses
 */
export const INVALID_EMAILS = [
  'invalid',
  '@example.com',
  'test@',
  'test @example.com',
  'test@example',
];

/**
 * Valid URLs
 */
export const VALID_URLS = [
  'https://example.com',
  'http://test.com/path',
  'https://subdomain.example.com/path?query=value',
  'ftp://files.example.com',
];

/**
 * Invalid URLs
 */
export const INVALID_URLS = ['not-a-url', 'htp://wrong', 'example.com', '//invalid'];

/**
 * Valid UUIDs
 */
export const VALID_UUIDS = [
  '550e8400-e29b-41d4-a716-446655440000',
  '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
];

/**
 * Invalid UUIDs
 */
export const INVALID_UUIDS = ['invalid-uuid', '550e8400-e29b-41d4-a716', 'not-a-uuid-at-all'];

/**
 * Valid dates
 */
export const VALID_DATES = [new Date('2024-01-01'), new Date('2023-12-31T23:59:59'), new Date()];

/**
 * Test user object
 */
export const TEST_USER = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  active: true,
};

/**
 * Test form data
 */
export const TEST_FORM_DATA = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
  age: 25,
  terms: true,
};

/**
 * Test array data
 */
export const TEST_ARRAYS = {
  numbers: [1, 2, 3, 4, 5],
  strings: ['apple', 'banana', 'cherry'],
  mixed: [1, 'two', true, null],
  nested: [
    [1, 2],
    [3, 4],
    [5, 6],
  ],
  empty: [],
};

/**
 * Test object data
 */
export const TEST_OBJECTS = {
  simple: { a: 1, b: 2, c: 3 },
  nested: { user: { name: 'John', age: 30 }, settings: { theme: 'dark' } },
  withArrays: { items: [1, 2, 3], tags: ['a', 'b'] },
  empty: {},
};
