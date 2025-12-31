# Validators Guide (Fluent API)

Complete guide to Valora's fluent, chainable validator API.

## Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [String Validators](#string-validators)
- [Number Validators](#number-validators)
- [Boolean Validators](#boolean-validators)
- [Date Validators](#date-validators)
- [Array Validators](#array-validators)
- [Object Validators](#object-validators)
- [Logic Validators](#logic-validators)
- [Type Inference](#type-inference)
- [Validation Results](#validation-results)

## Overview

The fluent API provides a chainable, schema-based approach to validation. Perfect for validating data, API requests, and configuration.

```typescript
import { v, Infer } from 'valora';

const userSchema = v.object({
  name: v.string().minLength(2),
  email: v.string().email(),
  age: v.number().min(18).optional(),
});

type User = Infer<typeof userSchema>;

const result = userSchema.validate(data);
```

## Core Concepts

### Validators are Immutable

Every method returns a **new** validator instance:

```typescript
const base = v.string();
const withMin = base.minLength(5);  // base is unchanged
const withMax = withMin.maxLength(20);  // withMin is unchanged
```

### Method Chaining

Chain methods to build complex validation:

```typescript
v.string()
  .required()
  .email()
  .maxLength(255)
  .message('Invalid email address');
```

### Optional vs Required

By default, validators **require** a value:

```typescript
v.string().validate('')  // ✅ Valid (empty string is a string)
v.string().validate(undefined)  // ❌ Fails

v.string().optional().validate(undefined)  // ✅ Valid
v.string().required().validate(undefined)  // ❌ Fails
```

## String Validators

### Basic Type

```typescript
import { v } from 'valora';

// Type check
v.string()  // Must be a string
```

### Format Validators

```typescript
// Email validation
v.string().email()
// 'user@example.com' ✅ | 'invalid' ❌

// URL validation
v.string().url()
// 'https://example.com' ✅ | 'not-a-url' ❌

// UUID v4 validation
v.string().uuid()
// '550e8400-e29b-41d4-a716-446655440000' ✅
```

### Length Validators

```typescript
// Minimum length
v.string().minLength(5)
v.string().min(5)  // Alias

// Maximum length
v.string().maxLength(100)
v.string().max(100)  // Alias

// Exact length
v.string().length(6)
// '123456' ✅ | '12345' ❌

// Combining
v.string().minLength(5).maxLength(20)
```

### Pattern Validators

```typescript
// Regex matching
v.string().matches(/^[a-z]+$/)
v.string().pattern(/^[a-z]+$/)  // Alias
v.string().regex(/^[a-z]+$/)    // Alias

// Custom message
v.string().matches(/^[a-z]+$/, 'Must be lowercase letters only')

// String content
v.string().startsWith('https://')
v.string().endsWith('.pdf')
v.string().contains('@')
v.string().includes('@')  // Alias
```

### Character Set Validators

```typescript
// Only letters (a-z, A-Z)
v.string().alpha()

// Letters and numbers
v.string().alphanumeric()
v.string().alphanum()  // Alias

// Only numbers
v.string().numeric()
```

### Case Validators

```typescript
// All lowercase
v.string().lowercase()

// All uppercase
v.string().uppercase()
```

### Empty Validators

```typescript
// Not empty or whitespace only
v.string().notEmpty()
v.string().nonempty()  // Alias
```

### Transformers

```typescript
// Trim whitespace
v.string().trim()

// Convert to lowercase
v.string().toLowerCase()

// Convert to uppercase
v.string().toUpperCase()

// Chaining transformers
v.string().trim().toLowerCase()
```

### Complete Example

```typescript
const passwordSchema = v.string()
  .required()
  .minLength(8)
  .maxLength(128)
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain uppercase, lowercase, number, and special character'
  });

const result = passwordSchema.validate('MyP@ssw0rd');
if (result.success) {
  console.log('Valid password:', result.data);
}
```

## Number Validators

### Basic Type

```typescript
v.number()  // Must be a number (not NaN)
```

### Range Validators

```typescript
// Minimum value (inclusive)
v.number().min(0)

// Maximum value (inclusive)
v.number().max(100)

// Range (inclusive)
v.number().range(0, 100)
v.number().between(0, 100)  // Alias

// Combining
v.number().min(18).max(150)
```

### Type Validators

```typescript
// Must be an integer
v.number().integer()
v.number().int()  // Alias

// Must be finite (not Infinity/-Infinity)
v.number().finite()

// Must be a safe integer
v.number().safe()
v.number().safeInteger()  // Alias
```

### Sign Validators

```typescript
// Positive (> 0)
v.number().positive()

// Negative (< 0)
v.number().negative()

// Non-negative (>= 0)
v.number().nonNegative()
v.number().nonnegative()  // Alias

// Non-positive (<= 0)
v.number().nonPositive()
v.number().nonpositive()  // Alias
```

### Divisibility Validators

```typescript
// Multiple of
v.number().multipleOf(5)
v.number().step(5)  // Alias

// Example: prices in cents
v.number().integer().min(0).multipleOf(100)
```

### Complete Example

```typescript
const ageSchema = v.number()
  .required()
  .integer()
  .min(0)
  .max(150)
  .message('Age must be between 0 and 150');

const priceSchema = v.number()
  .positive()
  .finite()
  .multipleOf(0.01);  // Two decimal places
```

## Boolean Validators

```typescript
// Must be a boolean
v.boolean()

// Must be true
v.boolean().true()

// Must be false
v.boolean().false()

// Example: Terms acceptance
const termsSchema = v.boolean()
  .required()
  .true()
  .message('You must accept the terms and conditions');
```

## Date Validators

### Basic Type

```typescript
v.date()  // Must be a Date instance
```

### Range Validators

```typescript
// Minimum date
v.date().min(new Date('2024-01-01'))
v.date().min('2024-01-01')  // String also accepted

// Maximum date
v.date().max(new Date('2025-12-31'))

// Combining
v.date().min('2024-01-01').max('2025-12-31')
```

### Temporal Validators

```typescript
// Must be in the past
v.date().past()

// Must be in the future
v.date().future()

// Must be today
v.date().today()
```

### Comparison Validators

```typescript
// Before a date (exclusive)
v.date().before(new Date('2025-12-31'))

// After a date (exclusive)
v.date().after(new Date('2024-01-01'))
```

### Day of Week Validators

```typescript
// Monday-Friday
v.date().weekday()

// Saturday-Sunday
v.date().weekend()
```

### Age Validators

```typescript
// Minimum age (for birthdates)
v.date().minAge(18)

// Maximum age
v.date().maxAge(120)

// Combining
v.date().past().minAge(18).maxAge(120)
```

### Complete Example

```typescript
const birthdateSchema = v.date()
  .required()
  .past()
  .minAge(18)
  .maxAge(120)
  .message('You must be at least 18 years old');

const eventSchema = v.object({
  startDate: v.date().future(),
  endDate: v.date().future().after(v.ref('startDate')),
});
```

## Array Validators

### Basic Type

```typescript
v.array()  // Must be an array
```

### Item Validation

```typescript
// Array of strings
v.array().of(v.string())

// Array of numbers
v.array().items(v.number())  // Alias

// Array of objects
v.array().of(v.object({
  id: v.string(),
  name: v.string(),
}))

// Nested arrays
v.array().of(v.array().of(v.number()))
```

### Length Validators

```typescript
// Minimum length
v.array().min(1)
v.array().minLength(1)  // Alias

// Maximum length
v.array().max(10)
v.array().maxLength(10)  // Alias

// Exact length
v.array().length(3)

// Range
v.array().range(1, 10)
v.array().between(1, 10)  // Alias
```

### Content Validators

```typescript
// Not empty
v.array().nonEmpty()
v.array().notEmpty()  // Alias

// All items unique
v.array().unique()
v.array().distinct()  // Alias

// Contains specific value
v.array().contains('admin')
v.array().includes('admin')  // Alias
```

### Predicate Validators

```typescript
// Every item must satisfy predicate
v.array().every((item, index) => item > 0)

// At least one item must satisfy predicate
v.array().some((item, index) => item > 100)

// None of the items should satisfy predicate
v.array().none((item, index) => item < 0)
```

### Complete Example

```typescript
const tagsSchema = v.array()
  .of(v.string().minLength(2).maxLength(20))
  .min(1)
  .max(5)
  .unique()
  .message('Please provide 1-5 unique tags');

const coordinatesSchema = v.array()
  .of(v.number())
  .length(2)
  .message('Coordinates must be [lat, lng]');
```

## Object Validators

### Schema Definition

```typescript
// Define object shape
const userSchema = v.object({
  name: v.string(),
  email: v.string().email(),
  age: v.number().optional(),
});

// Alternative: shape method
const userSchema = v.object().shape({
  name: v.string(),
  email: v.string().email(),
});
```

### Schema Modifiers

```typescript
// Make all fields optional
const partialUserSchema = userSchema.partial();

// Pick specific fields
const nameOnlySchema = userSchema.pick('name');
const nameEmailSchema = userSchema.pick('name', 'email');

// Omit specific fields
const noAgeSchema = userSchema.omit('age');
```

### Extending Schemas

```typescript
const baseSchema = v.object({
  id: v.string(),
  createdAt: v.date(),
});

// Extend with more fields
const userSchema = baseSchema.extend({
  name: v.string(),
  email: v.string().email(),
});

// Merge two schemas
const schema1 = v.object({ a: v.string() });
const schema2 = v.object({ b: v.number() });
const merged = schema1.merge(schema2);
```

### Extra Keys Handling

```typescript
// Strict mode - fail if unknown keys present
v.object({ name: v.string() }).strict()
// { name: 'John' } ✅
// { name: 'John', extra: 'value' } ❌

// Passthrough mode - allow and preserve extra keys
v.object({ name: v.string() }).passthrough()
// { name: 'John', extra: 'value' } ✅ (extra preserved)

// Strip mode - remove extra keys
v.object({ name: v.string() }).strip()
// { name: 'John', extra: 'value' } ✅ → { name: 'John' }
```

### Key Count Validators

```typescript
// Minimum number of keys
v.object().minKeys(1)

// Maximum number of keys
v.object().maxKeys(10)

// Exact number of keys
v.object().keyCount(5)
```

### Nested Objects

```typescript
const addressSchema = v.object({
  street: v.string(),
  city: v.string(),
  zipCode: v.string().length(5),
});

const userSchema = v.object({
  name: v.string(),
  address: addressSchema,  // Nested object
  previousAddresses: v.array().of(addressSchema),  // Array of objects
});
```

### Complete Example

```typescript
const createUserSchema = v.object({
  name: v.string().minLength(2).maxLength(50),
  email: v.string().email(),
  password: v.string().minLength(8),
  birthDate: v.date().past().minAge(18),
  address: v.object({
    street: v.string(),
    city: v.string(),
    zipCode: v.string().matches(/^\d{5}$/),
  }),
  tags: v.array().of(v.string()).max(10).optional(),
}).strict();

type CreateUserDto = Infer<typeof createUserSchema>;
```

## Logic Validators

### Combining Validators

```typescript
import { and, or, not } from 'valora';

// AND - all must pass
const strictEmail = and(
  v.string().email(),
  v.string().endsWith('@company.com')
);

// OR - at least one must pass
const idOrEmail = or(
  v.string().uuid(),
  v.string().email()
);

// NOT - must fail
const notAdmin = not(v.string().equals('admin'));
```

### Conditional Validation

```typescript
import { ifThenElse } from 'valora';

// If condition is met, apply then validator, else apply else validator
const conditionalSchema = ifThenElse(
  v.boolean(),  // condition
  v.string(),   // then
  v.number()    // else
);
```

### Union Types

```typescript
import { union } from 'valora';

// Accept multiple types
const stringOrNumber = union([
  v.string(),
  v.number(),
]);

stringOrNumber.validate('hello');  // ✅
stringOrNumber.validate(42);       // ✅
stringOrNumber.validate(true);     // ❌
```

### Intersection Types

```typescript
import { intersection } from 'valora';

// Must satisfy all validators
const strictString = intersection([
  v.string().minLength(5),
  v.string().maxLength(20),
  v.string().alpha(),
]);
```

## Type Inference

### Infer Types from Schemas

```typescript
import { v, Infer } from 'valora';

const userSchema = v.object({
  name: v.string(),
  age: v.number().optional(),
  tags: v.array().of(v.string()),
});

// TypeScript type inferred from schema
type User = Infer<typeof userSchema>;
// Equivalent to:
// type User = {
//   name: string;
//   age?: number;
//   tags: string[];
// }
```

### Complex Type Inference

```typescript
const postSchema = v.object({
  id: v.string().uuid(),
  title: v.string(),
  author: v.object({
    id: v.string(),
    name: v.string(),
  }),
  tags: v.array().of(v.string()),
  publishedAt: v.date().optional(),
});

type Post = Infer<typeof postSchema>;
// Fully typed, including nested objects!
```

## Validation Results

### Success Result

```typescript
const result = v.string().validate('hello');

if (result.success) {
  console.log(result.data);  // 'hello' (fully typed!)
  // result.errors does not exist
}
```

### Error Result

```typescript
const result = v.string().email().validate('invalid');

if (!result.success) {
  console.log(result.errors);
  // [
  //   {
  //     path: '',
  //     message: 'Invalid email address',
  //     code: 'string.email',
  //     value: 'invalid'
  //   }
  // ]
  // result.data does not exist
}
```

### Error Details

```typescript
interface ValidationError {
  path: string;       // Property path (e.g., 'user.email')
  message: string;    // Human-readable error message
  code: string;       // Error code (e.g., 'string.email')
  value: unknown;     // The invalid value
  context?: Record<string, unknown>;  // Additional context
}
```

### Nested Errors

```typescript
const schema = v.object({
  user: v.object({
    email: v.string().email(),
  }),
});

const result = schema.validate({
  user: { email: 'invalid' }
});

if (!result.success) {
  console.log(result.errors[0].path);  // 'user.email'
}
```

## Custom Error Messages

### Method-Level Messages

```typescript
v.string()
  .minLength(5, 'Name must be at least 5 characters')
  .email('Please provide a valid email address');
```

### Global Message Override

```typescript
v.string()
  .email()
  .minLength(5)
  .message('Invalid email format or too short');
```

## Transformations

### Built-in Transformers

```typescript
// String transformers
v.string().trim()
v.string().toLowerCase()
v.string().toUpperCase()

// Custom transformations
v.string().transform((s) => s.replace(/\s+/g, '-'))
```

### Coercion

```typescript
import { coerce } from 'valora';

// Coerce to number
coerce.number().validate('42');  // ✅ → 42

// Coerce to boolean
coerce.boolean().validate('true');  // ✅ → true

// Coerce to date
coerce.date().validate('2024-01-01');  // ✅ → Date object
```

## Best Practices

1. **Define schemas at module level** - Reuse them across your application
2. **Use type inference** - Let TypeScript derive types from schemas
3. **Provide custom messages** - Better user experience
4. **Compose small schemas** - Build complex schemas from simple ones
5. **Use strict mode for APIs** - Reject unexpected fields
6. **Validate at boundaries** - API endpoints, file inputs, user forms

## Next Steps

- Learn about [Decorators](./decorators-guide.md) for class-based validation
- Explore [Advanced Usage](./advanced-usage.md) for custom validators
- See [Examples](./examples.md) for real-world patterns
- Check [API Reference](./api-reference.md) for complete details
