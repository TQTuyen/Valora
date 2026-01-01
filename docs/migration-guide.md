# Migration Guide

Guide for upgrading to new versions of Valora and migrating from legacy decorators.

## Table of Contents

- [Migrating from Legacy @field() Decorator](#migrating-from-legacy-field-decorator)
- [Breaking Changes](#breaking-changes)
- [Deprecation Warnings](#deprecation-warnings)
- [Upgrade Paths](#upgrade-paths)
- [Common Migration Patterns](#common-migration-patterns)

## Migrating from Legacy @field() Decorator

### Overview

Valora v1.0 introduces a class-validator style decorator system that replaces the legacy `@field()` and `@validate()` decorators. The new system provides:

- **More decorators**: 63 specialized decorators vs generic `@field()`
- **Better readability**: `@IsString() @MinLength(5)` vs `@field(string().minLength(5))`
- **Type safety**: Full TypeScript support
- **Familiar API**: Class-validator compatible

### Before (Legacy)

```typescript
import { field, validate } from '@tqtos/valora';

class User {
  @field(string().minLength(2).maxLength(50))
  name: string;

  @field(string().email())
  email: string;

  @field(number().min(0).optional())
  age?: number;

  @validate()
  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}
```

### After (New Decorators)

```typescript
import {
  Validate,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsNumber,
  Min,
  IsOptional,
} from '@tqtos/valora/decorators';

@Validate()
class User {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  age?: number;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}
```

## Breaking Changes

### v1.0.0

#### 1. New Decorator System Required

The legacy `@field()` decorator is **deprecated** but still functional. However, the new decorator system is recommended for all new code.

**Migration Steps:**

1. Replace `@field()` with type-specific decorators
2. Add `@Validate()` to class
3. Remove `@validate()` from constructor
4. Update imports to use `valora/decorators`

#### 2. Auto-Validation on Construction

**Before:**

```typescript
class User {
  @field(string())
  name: string;

  @validate()  // Explicit validation call
  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}
```

**After:**

```typescript
@Validate() // Auto-validates on construction
class User {
  @IsString()
  name: string;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
    // Validation happens automatically
  }
}
```

To disable auto-validation:

```typescript
@Validate({ validateOnCreate: false })
class User {
  // ...
}

// Manually validate
const result = validateClassInstance(user);
```

#### 3. Error Handling Changes

**Before:**

```typescript
// No specific error type
```

**After:**

```typescript
import { ValoraValidationError } from '@tqtos/valora/decorators';

try {
  new User(invalidData);
} catch (error) {
  if (error instanceof ValoraValidationError) {
    console.log(error.errors);
  }
}
```

#### 4. Nested Validation

**Before:**

```typescript
class User {
  @field(
    object({
      street: string(),
      city: string(),
    }),
  )
  address: Address;
}
```

**After:**

```typescript
@Validate()
class Address {
  @IsString() street: string;
  @IsString() city: string;
}

@Validate()
class User {
  @ValidateNested()
  address: Address;
}
```

## Deprecation Warnings

### Current Deprecations (v1.0.0)

#### 1. `@field()` Decorator

**Status**: Deprecated but functional
**Removal**: Planned for v2.0.0

**Warning Message:**

```
@field() decorator is deprecated. Use type-specific decorators instead.
Example: @IsString() @MinLength(5) instead of @field(string().minLength(5))
```

**Migration:**

```typescript
// Old
@field(string().email())
email: string;

// New
@IsEmail()
email: string;
```

#### 2. Constructor `@validate()` Decorator

**Status**: Deprecated but functional
**Removal**: Planned for v2.0.0

**Warning Message:**

```
@validate() decorator is deprecated. Use @Validate() class decorator instead.
```

**Migration:**

```typescript
// Old
class User {
  @field(string()) name: string;

  @validate()
  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}

// New
@Validate()
class User {
  @IsString() name: string;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}
```

## Upgrade Paths

### Path 1: Gradual Migration (Recommended)

Migrate incrementally while maintaining backward compatibility.

**Step 1**: Install latest version

```bash
bun add @tqtos/valora@latest
```

**Step 2**: Update TypeScript config

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

**Step 3**: Migrate one class at a time

```typescript
// Keep old classes working
class OldUser {
  @field(string()) name: string;
}

// Add new classes with new decorators
@Validate()
class NewUser {
  @IsString() name: string;
}
```

**Step 4**: Update imports as you migrate

```typescript
// Old imports (still work)
import { field, validate } from '@tqtos/valora';

// New imports
import { Validate, IsString } from '@tqtos/valora/decorators';
```

**Step 5**: Test thoroughly after each migration

### Path 2: Full Migration

Migrate everything at once (for smaller codebases).

**Step 1**: Find all uses of `@field()`

```bash
rg "@field\(" src/
```

**Step 2**: Create migration script

```typescript
// migration-helper.ts
export function mapFieldToDecorators(fieldValidator: string): string[] {
  // Parse field validator and return equivalent decorators
  const decorators: string[] = [];

  if (fieldValidator.includes('string()')) {
    decorators.push('@IsString()');
  }
  if (fieldValidator.includes('email()')) {
    decorators.push('@IsEmail()');
  }
  // ... more mappings

  return decorators;
}
```

**Step 3**: Update all classes systematically

**Step 4**: Remove old imports

```bash
# Find files using old decorators
rg "from '@tqtos/valora'" --files-with-matches | grep -v "@tqtos/valora/decorators"
```

## Common Migration Patterns

### Pattern 1: Simple String Field

```typescript
// Before
@field(string().minLength(2).maxLength(50))
name: string;

// After
@IsString()
@MinLength(2)
@MaxLength(50)
name: string;
```

### Pattern 2: Optional Number

```typescript
// Before
@field(number().min(0).optional())
age?: number;

// After
@IsOptional()
@IsNumber()
@Min(0)
age?: number;
```

### Pattern 3: Email Validation

```typescript
// Before
@field(string().email().maxLength(255))
email: string;

// After
@IsEmail()
@MaxLength(255)
email: string;
```

### Pattern 4: Array Validation

```typescript
// Before
@field(array().of(string()).min(1).max(10))
tags: string[];

// After
@IsArray()
@ArrayMinSize(1)
@ArrayMaxSize(10)
// Note: Item validation requires ValidateNested + custom class
tags: string[];
```

### Pattern 5: Nested Object

```typescript
// Before
@field(object({
  street: string(),
  city: string(),
}))
address: Address;

// After
// First, define Address class
@Validate()
class Address {
  @IsString() street: string;
  @IsString() city: string;
}

// Then use ValidateNested
@ValidateNested()
address: Address;
```

### Pattern 6: Custom Validation

```typescript
// Before
@field(string().custom((value) => value !== 'admin', 'Cannot be admin'))
username: string;

// After
// Create custom decorator
function IsNotAdmin(): PropertyDecorator {
  return createPropertyDecorator(() => ({
    validate: (value) => {
      if (value === 'admin') {
        return { success: false, errors: [{ message: 'Cannot be admin' }] };
      }
      return { success: true, data: value };
    }
  }))();
}

@IsString()
@IsNotAdmin()
username: string;
```

### Pattern 7: Date Validation

```typescript
// Before
@field(date().past().minAge(18))
birthDate: Date;

// After
@IsDate()
@IsPast()
@MinAge(18)
birthDate: Date;
```

### Pattern 8: Boolean with Constraint

```typescript
// Before
@field(boolean().equals(true))
termsAccepted: boolean;

// After
@IsBoolean()
@IsTrue()
termsAccepted: boolean;
```

## Mapping Table

Quick reference for migrating validators:

| Legacy `@field()` | New Decorators                      |
| ----------------- | ----------------------------------- |
| `string()`        | `@IsString()`                       |
| `number()`        | `@IsNumber()`                       |
| `boolean()`       | `@IsBoolean()`                      |
| `date()`          | `@IsDate()`                         |
| `array()`         | `@IsArray()`                        |
| `object()`        | `@IsObject()` + `@ValidateNested()` |
| `.optional()`     | `@IsOptional()`                     |
| `.required()`     | `@IsRequired()`                     |
| `.email()`        | `@IsEmail()`                        |
| `.url()`          | `@IsUrl()`                          |
| `.uuid()`         | `@IsUuid()`                         |
| `.minLength(n)`   | `@MinLength(n)`                     |
| `.maxLength(n)`   | `@MaxLength(n)`                     |
| `.length(n)`      | `@Length(n)`                        |
| `.min(n)`         | `@Min(n)`                           |
| `.max(n)`         | `@Max(n)`                           |
| `.positive()`     | `@IsPositive()`                     |
| `.negative()`     | `@IsNegative()`                     |
| `.integer()`      | `@IsInt()`                          |
| `.past()`         | `@IsPast()`                         |
| `.future()`       | `@IsFuture()`                       |
| `.minAge(n)`      | `@MinAge(n)`                        |

## Testing After Migration

### 1. Update Tests

```typescript
// Before
describe('User validation', () => {
  it('validates name', () => {
    expect(() => new User({ name: 'a' })).toThrow();
  });
});

// After (same but with better error checking)
describe('User validation', () => {
  it('validates name', () => {
    expect(() => new User({ name: 'a' })).toThrow(ValoraValidationError);
  });
});
```

### 2. Verify Error Messages

```typescript
try {
  new User({ name: '' });
} catch (error) {
  if (error instanceof ValoraValidationError) {
    expect(error.errors).toHaveLength(1);
    expect(error.errors[0].path).toBe('name');
  }
}
```

## Troubleshooting

### Issue: "Decorator is not a function"

**Cause**: TypeScript configuration missing
**Fix**: Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### Issue: Validation not running

**Cause**: Missing `@Validate()` class decorator
**Fix**: Add `@Validate()` to class

### Issue: Nested validation not working

**Cause**: Nested class missing `@Validate()` or using `@ValidateNested()`
**Fix**:

```typescript
@Validate()
class NestedClass {}

@Validate()
class ParentClass {
  @ValidateNested()
  nested: NestedClass;
}
```

### Issue: Optional fields showing errors

**Cause**: Missing `@IsOptional()` decorator
**Fix**: Add `@IsOptional()` before type decorators:

```typescript
@IsOptional()
@IsString()
middleName?: string;
```

## Getting Help

- Check [Examples](./examples.md) for migration patterns
- Review [API Reference](./api-reference.md) for decorator details
- Visit [GitHub Issues](https://github.com/TQTuyen/Valora/issues) for support

## Version History

### v1.0.0 (Current)

- Introduced new decorator system (63 decorators)
- Deprecated `@field()` and constructor `@validate()`
- Added `@Validate()` class decorator
- Added `ValoraValidationError` type
- Full backward compatibility maintained

### Planned v2.0.0

- Remove deprecated `@field()` decorator
- Remove constructor `@validate()` decorator
- New features TBD

## Feedback

We value your feedback on the migration process! Please share your experience:

- **GitHub Discussions**: Share migration tips
- **Issues**: Report migration problems
- **Pull Requests**: Improve migration tools
