# Valora

**Production-grade TypeScript-first validation framework with class-validator style decorators**

🔗 **GitHub**: [https://github.com/TQTuyen/Valora](https://github.com/TQTuyen/Valora)  
📦 **npm**: [https://www.npmjs.com/package/@tqtos/valora](https://www.npmjs.com/package/@tqtos/valora)

A modern, tree-shakeable validation framework for JavaScript/TypeScript with dual APIs: elegant class decorators and chainable fluent validators.

## ✨ Features

- 🎨 **Class-Validator Style Decorators** - Familiar, elegant validation syntax with 63+ decorators
- 🔗 **Fluent Chainable API** - `v.string().email().minLength(5)` for schema-based validation
- 🌳 **Tree-Shakeable** - Import only what you need, zero unused code
- 🏗️ **SOLID Architecture** - Built with 6 GoF design patterns for maintainability
- 🌍 **i18n Support** - English & Vietnamese built-in, easily extensible
- 🔒 **Type-Safe** - Full TypeScript inference with `Infer<T>`
- 🎯 **Framework Agnostic** - Core works everywhere
- 🎨 **Framework Adapters** - React, Vue, Svelte, Solid, Vanilla JS
- ⚡ **Production-Ready** - Comprehensive test coverage

## 📦 Installation

```bash
# Using bun (recommended)
bun add @tqtos/valora

# Using npm
npm install @tqtos/valora

# Using yarn
yarn add @tqtos/valora

# Using pnpm
pnpm add @tqtos/valora
```

## 🚀 Quick Start

### Option 1: Decorators (Recommended for Classes)

Perfect for validating class instances, DTOs, and domain models.

```typescript
import { Validate, IsString, IsEmail, MinLength, Min, IsNumber } from '@tqtos/valora/decorators';

@Validate()
class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @Min(18)
  age: number;
}

// Auto-validates on construction!
try {
  const user = new CreateUserDto({
    name: 'John Doe',
    email: 'john@example.com',
    age: 25,
  });
  console.log('Valid user:', user);
} catch (error) {
  console.error('Validation error:', error.message);
}
```

### Option 2: Fluent API (Recommended for Schemas)

Perfect for validating data, API requests, and configuration.

```typescript
import { v, Infer } from '@tqtos/valora';

// Define schema
const createUserSchema = v.object({
  name: v.string().minLength(2),
  email: v.string().email(),
  age: v.number().min(18).optional(),
});

// Infer TypeScript type
type CreateUserDto = Infer<typeof createUserSchema>;

// Validate data
const result = createUserSchema.validate({
  name: 'John Doe',
  email: 'john@example.com',
  age: 25,
});

if (result.success) {
  console.log('Valid data:', result.data); // Fully typed!
} else {
  console.error('Validation errors:', result.errors);
}
```

## 📚 Documentation

**Complete guides for learning and reference:**

- **[Getting Started](./docs/getting-started.md)** - Installation, first steps, and basic patterns
- **[Decorators Guide](./docs/decorators-guide.md)** - Complete reference for all 63 decorators
- **[Validators Guide](./docs/validators-guide.md)** - Fluent API reference and schema validation
- **[Nested Validation](./docs/nested-validation.md)** - Working with nested objects and arrays
- **[Advanced Usage](./docs/advanced-usage.md)** - Custom validators, i18n, async validation, and more
- **[Examples](./docs/examples.md)** - Real-world use cases and patterns
- **[API Reference](./docs/api-reference.md)** - Complete API documentation
- **[Migration Guide](./docs/migration-guide.md)** - Upgrading from legacy decorators

## 🎯 Available Decorators

### Common (2)

`@IsOptional()` `@IsRequired()`

### String (17)

`@IsString()` `@IsEmail()` `@IsUrl()` `@IsUuid()` `@MinLength()` `@MaxLength()` `@Length()` `@Matches()` `@StartsWith()` `@EndsWith()` `@Contains()` `@IsAlpha()` `@IsAlphanumeric()` `@IsNumeric()` `@IsLowercase()` `@IsUppercase()` `@NotEmpty()`

### Number (10)

`@IsNumber()` `@IsInt()` `@IsFinite()` `@IsSafeInt()` `@Min()` `@Max()` `@Range()` `@IsPositive()` `@IsNegative()` `@IsMultipleOf()`

### Boolean (3)

`@IsBoolean()` `@IsTrue()` `@IsFalse()`

### Date (12)

`@IsDate()` `@MinDate()` `@MaxDate()` `@IsPast()` `@IsFuture()` `@IsToday()` `@IsBefore()` `@IsAfter()` `@IsWeekday()` `@IsWeekend()` `@MinAge()` `@MaxAge()`

### Array (7)

`@IsArray()` `@ArrayMinSize()` `@ArrayMaxSize()` `@ArrayLength()` `@ArrayNotEmpty()` `@ArrayUnique()` `@ArrayContains()`

### Object (2)

`@IsObject()` `@ValidateNested()`

## 🔧 Validators

### Built-in Categories

- **String** - `email()`, `url()`, `uuid()`, `minLength()`, `maxLength()`, `matches()`, etc.
- **Number** - `min()`, `max()`, `range()`, `positive()`, `integer()`, `finite()`, etc.
- **Date** - `past()`, `future()`, `minAge()`, `maxAge()`, `weekday()`, `weekend()`, etc.
- **Array** - `of()`, `min()`, `max()`, `unique()`, `contains()`, `every()`, `some()`, etc.
- **Object** - `shape()`, `partial()`, `pick()`, `omit()`, `strict()`, `passthrough()`, etc.
- **Boolean** - `true()`, `false()`, `required()`
- **File** - `maxSize()`, `mimeType()`, `extension()`, `dimensions()`
- **Business** - `creditCard()`, `phone()`, `iban()`, `ssn()`, `slug()`
- **Async** - `async()`, `debounce()`, `timeout()`, `retry()`
- **Logic** - `and()`, `or()`, `not()`, `union()`, `intersection()`, `ifThenElse()`

## 🌍 Internationalization

Built-in support for English and Vietnamese, easily extensible:

```typescript
import { globalI18n } from '@tqtos/valora/plugins';

// Switch to Vietnamese
globalI18n.setLocale('vi');

// Add custom locale
globalI18n.loadLocale('fr', {
  string: {
    required: 'Ce champ est obligatoire',
    email: 'Adresse email invalide',
  },
});
```

## 🎨 Framework Adapters

### React

```tsx
import { useValora } from '@tqtos/valora/adapters/react';

export function LoginForm() {
  const { validate, errors } = useValora();

  return (
    <form>
      <input placeholder="Email" onBlur={(e) => validate('email', e.target.value)} />
      {errors.email && <span>{errors.email}</span>}
    </form>
  );
}
```

### Vue

```vue
<script setup>
import { useValora } from '@tqtos/valora/adapters/vue';

const { validate, errors } = useValora();
</script>

<template>
  <input placeholder="Email" @blur="validate('email', $event.target.value)" />
  <span v-if="errors.email">{{ errors.email }}</span>
</template>
```

## 📁 Project Structure

```
valora/
├── src/
│   ├── core/             # Validation engine & design patterns
│   ├── decorators/       # Class-validator style decorators
│   ├── validators/       # Fluent validators (string, number, date, etc.)
│   ├── adapters/         # Framework integrations (React, Vue, Svelte, etc.)
│   ├── plugins/          # i18n, logger, cache, transform, devtools
│   ├── schema/           # Schema builder & coercion
│   ├── notification/     # Event notification system
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript type definitions
├── tests/                # Test files (unit, integration, e2e)
├── examples/             # Framework-specific examples
├── docs/                 # Comprehensive documentation
└── dist/                 # Build output (generated)
```

## 🛠️ Available Scripts

```bash
# Development
bun run dev              # Watch mode build
bun run build            # Production build with type checking
bun run typecheck        # Type check only

# Testing
bun run test             # Run tests in watch mode
bun run test:run         # Run tests once
bun run test:coverage    # Run tests with coverage report
bun run test:ui          # Run tests with UI

# Code Quality
bun run lint             # Lint source code
bun run lint:fix         # Lint and auto-fix issues
bun run format           # Format code with Prettier
bun run format:check     # Check formatting without changes

# Maintenance
bun run clean            # Remove dist/ directory
```

## 🏗️ Architecture

Valora is built with SOLID principles and implements 6 Gang of Four design patterns:

- **Strategy Pattern** - Pluggable validation strategies
- **Chain of Responsibility** - Validation pipeline
- **Observer Pattern** - Event notifications
- **Factory Pattern** - Validator creation
- **Decorator Pattern** - Validator composition
- **Composite Pattern** - Nested validation

## 🔒 Type Safety

Full TypeScript support with:

- Strict mode enabled
- Explicit return types
- Type inference with `Infer<T>`
- Path aliases support (`@/`, `@validators/`, etc.)

```typescript
import { v, Infer } from '@tqtos/valora';

const userSchema = v.object({
  name: v.string(),
  age: v.number().optional(),
});

type User = Infer<typeof userSchema>;
// type User = { name: string; age?: number }
```

## 🧪 Testing

Tests use Vitest with:

- 70% minimum coverage threshold
- v8 coverage provider
- Type checking enabled
- Both unit and integration tests

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes following the code conventions
3. Run tests: `bun run test`
4. Run linter: `bun run lint:fix`
5. Format code: `bun run format`
6. Commit: `git commit -m "feat: add my feature"`

## 📝 Code Conventions

- **Variables/Functions**: `camelCase`
- **Classes/Interfaces/Types**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**: `kebab-case.ts` for modules

### TypeScript Best Practices

- Prefer `interface` for object shapes
- Use `type` for unions and utility types
- Import types with `import type {}`
- No `any` types without justification
- Explicit return types on public functions

## 🚀 Development Setup

1. Install Bun (https://bun.sh)
2. Clone the repository
3. Run `bun install`
4. Run `bun run dev` to start watch mode
5. Check `.claude/CLAUDE.md` for project guidelines

## 📄 License

MIT © Valora Team

## 🔗 Resources

- [GitHub Repository](https://github.com/TQTuyen/Valora)
- [GitHub Issues](https://github.com/TQTuyen/Valora/issues)
- [Documentation](./docs/README.md)

---

**Built with TypeScript, Vite, and Vitest**
