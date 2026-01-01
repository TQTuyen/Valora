# API Reference

Complete API documentation for Valora validation framework.

## Table of Contents

- [Core Exports](#core-exports)
- [Decorator API](#decorator-api)
- [Fluent Validator API](#fluent-validator-api)
- [Type Utilities](#type-utilities)
- [Error Types](#error-types)
- [Plugin System](#plugin-system)
- [Utility Functions](#utility-functions)

## Core Exports

### Main Entry Points

```typescript
// Fluent API (schema-based)
import { v } from '@tqtos/valora';

// Decorators (class-based)
import { Validate, IsString, IsEmail } from '@tqtos/valora/decorators';

// Types
import type { ValidationResult, ValidationError, Infer } from '@tqtos/valora/types';

// Plugins
import { I18nPlugin, globalI18n } from '@tqtos/valora/plugins';
```

## Decorator API

### Class Decorators

#### `@Validate(options?)`

Marks a class for validation and enables property decorators.

**Options:**

- `validateOnCreate` (boolean, default: `true`) - Auto-validate on instantiation
- `throwOnError` (boolean, default: `true`) - Throw ValoraValidationError on failure

```typescript
@Validate()
class User {
  @IsString() name: string;
}

@Validate({ validateOnCreate: false })
class ManualUser {
  @IsString() name: string;
}

@Validate({ throwOnError: false })
class NoThrowUser {
  @IsString() name: string;
}
```

### Property Decorators

#### Common Decorators

**`@IsOptional()`** - Allows `undefined` values

```typescript
@IsOptional()
@IsString()
middleName?: string;
```

**`@IsRequired()`** - Explicitly requires value (rejects `null` and `undefined`)

```typescript
@IsRequired()
@IsString()
name: string;
```

#### String Decorators

| Decorator              | Description           | Example                   |
| ---------------------- | --------------------- | ------------------------- |
| `@IsString()`          | Must be a string      | `@IsString()`             |
| `@IsEmail()`           | Valid email format    | `@IsEmail()`              |
| `@IsUrl()`             | Valid URL format      | `@IsUrl()`                |
| `@IsUuid()`            | Valid UUID v4         | `@IsUuid()`               |
| `@MinLength(min)`      | Minimum string length | `@MinLength(5)`           |
| `@MaxLength(max)`      | Maximum string length | `@MaxLength(100)`         |
| `@Length(exact)`       | Exact string length   | `@Length(6)`              |
| `@Matches(pattern)`    | Regex pattern match   | `@Matches(/^[a-z]+$/)`    |
| `@StartsWith(prefix)`  | Starts with prefix    | `@StartsWith('https://')` |
| `@EndsWith(suffix)`    | Ends with suffix      | `@EndsWith('.pdf')`       |
| `@Contains(substring)` | Contains substring    | `@Contains('@')`          |
| `@IsAlpha()`           | Only letters          | `@IsAlpha()`              |
| `@IsAlphanumeric()`    | Letters and numbers   | `@IsAlphanumeric()`       |
| `@IsNumeric()`         | Only numeric chars    | `@IsNumeric()`            |
| `@IsLowercase()`       | All lowercase         | `@IsLowercase()`          |
| `@IsUppercase()`       | All uppercase         | `@IsUppercase()`          |
| `@NotEmpty()`          | Not empty/whitespace  | `@NotEmpty()`             |

#### Number Decorators

| Decorator          | Description      | Example            |
| ------------------ | ---------------- | ------------------ |
| `@IsNumber()`      | Must be a number | `@IsNumber()`      |
| `@IsInt()`         | Must be integer  | `@IsInt()`         |
| `@IsFinite()`      | Must be finite   | `@IsFinite()`      |
| `@IsSafeInt()`     | Safe integer     | `@IsSafeInt()`     |
| `@Min(min)`        | Minimum value    | `@Min(0)`          |
| `@Max(max)`        | Maximum value    | `@Max(100)`        |
| `@Range(min, max)` | Value range      | `@Range(0, 100)`   |
| `@IsPositive()`    | Positive (> 0)   | `@IsPositive()`    |
| `@IsNegative()`    | Negative (< 0)   | `@IsNegative()`    |
| `@IsMultipleOf(n)` | Multiple of n    | `@IsMultipleOf(5)` |

#### Boolean Decorators

| Decorator      | Description     | Example        |
| -------------- | --------------- | -------------- |
| `@IsBoolean()` | Must be boolean | `@IsBoolean()` |
| `@IsTrue()`    | Must be true    | `@IsTrue()`    |
| `@IsFalse()`   | Must be false   | `@IsFalse()`   |

#### Date Decorators

| Decorator         | Description    | Example                            |
| ----------------- | -------------- | ---------------------------------- |
| `@IsDate()`       | Must be a Date | `@IsDate()`                        |
| `@MinDate(date)`  | Minimum date   | `@MinDate(new Date('2024-01-01'))` |
| `@MaxDate(date)`  | Maximum date   | `@MaxDate(new Date('2025-12-31'))` |
| `@IsPast()`       | Must be past   | `@IsPast()`                        |
| `@IsFuture()`     | Must be future | `@IsFuture()`                      |
| `@IsToday()`      | Must be today  | `@IsToday()`                       |
| `@IsBefore(date)` | Before date    | `@IsBefore(new Date())`            |
| `@IsAfter(date)`  | After date     | `@IsAfter(new Date())`             |
| `@IsWeekday()`    | Mon-Fri        | `@IsWeekday()`                     |
| `@IsWeekend()`    | Sat-Sun        | `@IsWeekend()`                     |
| `@MinAge(years)`  | Min age        | `@MinAge(18)`                      |
| `@MaxAge(years)`  | Max age        | `@MaxAge(120)`                     |

#### Array Decorators

| Decorator             | Description      | Example                   |
| --------------------- | ---------------- | ------------------------- |
| `@IsArray()`          | Must be array    | `@IsArray()`              |
| `@ArrayMinSize(min)`  | Min array length | `@ArrayMinSize(1)`        |
| `@ArrayMaxSize(max)`  | Max array length | `@ArrayMaxSize(10)`       |
| `@ArrayLength(n)`     | Exact length     | `@ArrayLength(3)`         |
| `@ArrayNotEmpty()`    | Not empty        | `@ArrayNotEmpty()`        |
| `@ArrayUnique()`      | All unique       | `@ArrayUnique()`          |
| `@ArrayContains(val)` | Contains value   | `@ArrayContains('admin')` |

#### Object Decorators

| Decorator                | Description       | Example             |
| ------------------------ | ----------------- | ------------------- |
| `@IsObject()`            | Must be object    | `@IsObject()`       |
| `@ValidateNested(opts?)` | Nested validation | `@ValidateNested()` |

**ValidateNested Options:**

- `each` (boolean) - Validate each item in array

```typescript
@ValidateNested()
address: Address;

@ValidateNested({ each: true })
addresses: Address[];
```

### Validation Functions

#### `validateClassInstance<T>(instance: T): ValidationResult<T>`

Manually validate a class instance.

```typescript
import { validateClassInstance } from '@tqtos/valora/decorators';

@Validate({ validateOnCreate: false })
class User {
  @IsString() name: string;
}

const user = new User({ name: 'John' });
const result = validateClassInstance(user);

if (result.success) {
  console.log(result.data);
} else {
  console.log(result.errors);
}
```

## Fluent Validator API

### Factory Functions

#### `v.string(): StringValidator`

Create a string validator.

```typescript
v.string().required().email().minLength(5).maxLength(255);
```

#### `v.number(): NumberValidator`

Create a number validator.

```typescript
v.number().required().integer().min(0).max(100);
```

#### `v.boolean(): BooleanValidator`

Create a boolean validator.

```typescript
v.boolean().required().true();
```

#### `v.date(): DateValidator`

Create a date validator.

```typescript
v.date().required().past().minAge(18);
```

#### `v.array<T>(): ArrayValidator<T>`

Create an array validator.

```typescript
v.array().of(v.string()).min(1).max(10).unique();
```

#### `v.object<T>(schema?): ObjectValidator<T>`

Create an object validator.

```typescript
v.object({
  name: v.string().required(),
  age: v.number().optional(),
});
```

### Common Methods

All validators share these methods:

#### `.required(): this`

Make the validator required (reject `undefined`).

```typescript
v.string().required();
```

#### `.optional(): this`

Make the validator optional (allow `undefined`).

```typescript
v.string().optional();
```

#### `.nullable(): this`

Allow `null` values.

```typescript
v.string().nullable();
```

#### `.default(value): this`

Provide a default value when undefined.

```typescript
v.string().default('N/A');
v.number().default(0);
```

#### `.message(msg): this`

Override error messages.

```typescript
v.string().email().message('Invalid email address');
```

#### `.transform<U>(fn): Validator<U>`

Transform the value after validation.

```typescript
v.string().transform((s) => s.toUpperCase());
```

#### `.validate(value): ValidationResult<T>`

Validate a value.

```typescript
const result = v.string().email().validate('user@example.com');

if (result.success) {
  console.log(result.data); // Type: string
} else {
  console.log(result.errors); // Type: ValidationError[]
}
```

### StringValidator Methods

```typescript
interface StringValidator {
  // Format
  email(): this;
  url(): this;
  uuid(): this;

  // Length
  minLength(min: number): this;
  min(min: number): this; // Alias
  maxLength(max: number): this;
  max(max: number): this; // Alias
  length(exact: number): this;

  // Pattern
  matches(pattern: RegExp, message?: string): this;
  pattern(pattern: RegExp, message?: string): this; // Alias
  regex(pattern: RegExp, message?: string): this; // Alias
  startsWith(prefix: string): this;
  endsWith(suffix: string): this;
  contains(substring: string): this;
  includes(substring: string): this; // Alias

  // Character set
  alpha(): this;
  alphanumeric(): this;
  alphanum(): this; // Alias
  numeric(): this;
  lowercase(): this;
  uppercase(): this;

  // Empty
  notEmpty(): this;
  nonempty(): this; // Alias

  // Transform
  trim(): this;
  toLowerCase(): this;
  toUpperCase(): this;
}
```

### NumberValidator Methods

```typescript
interface NumberValidator {
  // Range
  min(minimum: number): this;
  max(maximum: number): this;
  range(min: number, max: number): this;
  between(min: number, max: number): this; // Alias

  // Type
  integer(): this;
  int(): this; // Alias
  finite(): this;
  safe(): this;
  safeInteger(): this; // Alias

  // Sign
  positive(): this;
  negative(): this;
  nonNegative(): this;
  nonnegative(): this; // Alias
  nonPositive(): this;
  nonpositive(): this; // Alias

  // Divisibility
  multipleOf(factor: number): this;
  step(factor: number): this; // Alias
}
```

### ArrayValidator Methods

```typescript
interface ArrayValidator<T> {
  // Item validation
  of<U>(validator: IValidator<T, U>): ArrayValidator<U>;
  items<U>(validator: IValidator<T, U>): ArrayValidator<U>; // Alias

  // Length
  min(minLength: number): this;
  minLength(minLength: number): this; // Alias
  max(maxLength: number): this;
  maxLength(maxLength: number): this; // Alias
  length(exactLength: number): this;
  range(min: number, max: number): this;
  between(min: number, max: number): this; // Alias

  // Content
  nonEmpty(): this;
  notEmpty(): this; // Alias
  unique(): this;
  distinct(): this; // Alias
  contains(value: T): this;
  includes(value: T): this; // Alias

  // Predicates
  every(predicate: (item: T, index: number) => boolean): this;
  some(predicate: (item: T, index: number) => boolean): this;
  none(predicate: (item: T, index: number) => boolean): this;
}
```

### ObjectValidator Methods

```typescript
interface ObjectValidator<T> {
  // Schema
  shape<S>(schema: ObjectSchema<S>): ObjectValidator<S>;
  extend<E>(extension: ObjectSchema<E>): ObjectValidator<T & E>;
  merge<O>(other: ObjectValidator<O>): ObjectValidator<T & O>;

  // Modifiers
  partial(): ObjectValidator<Partial<T>>;
  pick<K extends keyof T>(...keys: K[]): ObjectValidator<Pick<T, K>>;
  omit<K extends keyof T>(...keys: K[]): ObjectValidator<Omit<T, K>>;

  // Extra keys
  strict(): this;
  passthrough(): this;
  strip(): this;

  // Key count
  minKeys(count: number): this;
  maxKeys(count: number): this;
  keyCount(count: number): this;
}
```

## Type Utilities

### `Infer<T>`

Extract TypeScript type from a validator schema.

```typescript
import { v, Infer } from '@tqtos/valora';

const userSchema = v.object({
  name: v.string(),
  age: v.number().optional(),
});

type User = Infer<typeof userSchema>;
// type User = {
//   name: string;
//   age?: number;
// }
```

### `ValidationResult<T>`

Result type for validation operations.

```typescript
type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };
```

### `ValidationError`

Error information from failed validation.

```typescript
interface ValidationError {
  path: string; // Property path (e.g., 'user.email')
  message: string; // Human-readable message
  code: string; // Error code (e.g., 'string.email')
  value: unknown; // The invalid value
  context?: Record<string, unknown>; // Additional context
}
```

## Error Types

### `ValoraValidationError`

Exception thrown when validation fails (decorators only).

```typescript
import { ValoraValidationError } from '@tqtos/valora/decorators';

try {
  new User({ name: '' });
} catch (error) {
  if (error instanceof ValoraValidationError) {
    console.log(error.message); // "Validation failed"
    console.log(error.errors); // ValidationError[]
  }
}
```

## Plugin System

### I18nPlugin

Internationalization plugin for custom error messages.

#### Constructor

```typescript
new I18nPlugin(config?: I18nConfig)

interface I18nConfig {
  defaultLocale?: string;      // Default: 'en'
  fallbackLocale?: string;     // Default: 'en'
  warnOnMissing?: boolean;     // Default: true
}
```

#### Methods

**`.t(key: string, params?: Record<string, unknown>): string`**

Translate a key with parameter interpolation.

```typescript
i18n.t('string.minLength', { min: 5 });
// "Must be at least 5 characters"
```

**`.setLocale(locale: string): void`**

Change the current locale.

```typescript
i18n.setLocale('vi');
```

**`.loadLocale(locale: string, messages: LocaleMessages): void`**

Load or update messages for a locale.

```typescript
i18n.loadLocale('fr', {
  string: {
    required: 'Ce champ est obligatoire',
  },
});
```

**`.hasLocale(locale: string): boolean`**

Check if a locale is loaded.

```typescript
i18n.hasLocale('fr'); // true/false
```

**`.getLocales(): string[]`**

Get all loaded locales.

```typescript
i18n.getLocales(); // ['en', 'vi', 'fr']
```

**`.namespace(ns: string): (key, params?) => string`**

Create a namespaced translation function.

```typescript
const ts = i18n.namespace('string');
ts('minLength', { min: 5 }); // Uses 'string.minLength'
```

### Global i18n Instance

```typescript
import { globalI18n } from '@tqtos/valora/plugins';

// Use the global instance
globalI18n.setLocale('vi');
globalI18n.t('string.email');
```

## Utility Functions

### Logic Combinators

```typescript
import { and, or, not, xor } from '@tqtos/valora';

// AND - all must pass
and(v.string().email(), v.string().endsWith('@company.com'));

// OR - at least one must pass
or(v.string().uuid(), v.string().email());

// NOT - must fail
not(v.string().equals('admin'));

// XOR - exactly one must pass
xor(v.string().email(), v.number());
```

### Conditional Validators

```typescript
import { ifThenElse } from '@tqtos/valora';

ifThenElse(
  v.boolean(), // condition
  v.string(), // then
  v.number(), // else
);
```

### Union & Intersection

```typescript
import { union, intersection } from '@tqtos/valora';

// Accept multiple types
union([v.string(), v.number()]);

// Must satisfy all
intersection([v.string().minLength(5), v.string().alpha()]);
```

### Coercion

```typescript
import { coerce } from '@tqtos/valora';

coerce.number().validate('42'); // → 42
coerce.boolean().validate('true'); // → true
coerce.date().validate('2024-01-01'); // → Date object
coerce.string().validate(123); // → '123'
```

## Version

Current version: **1.0.0**

For changelog and migration guides, see [Migration Guide](./migration-guide.md).
