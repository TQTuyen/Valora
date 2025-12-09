# Valora

A modern, tree-shakeable validation framework for JavaScript/TypeScript with framework adapters for React, Vue, Svelte, Solid, and Vanilla JS.

## Features

- 🎯 **Tree-shakeable** - Import only what you need
- 📦 **Framework Agnostic** - Core works everywhere
- 🔒 **Type-safe** - Full TypeScript support with strict mode
- 🔌 **Extensible** - Plugin system for customization
- ⚡ **Performant** - Lazy evaluation and caching support
- 🌍 **i18n Ready** - Built-in internationalization
- 🎨 **Framework Adapters** - React, Vue, Svelte, Solid, Vanilla JS

## Quick Start

### Installation

```bash
bun install
```

### Basic Usage

```typescript
import { required, email, minLength } from 'valora/validators/string';

// Create a validator
const validator = required();

// Validate a value
const result = validator.validate('user@example.com');
console.log(result.valid); // true
```

### With Adapters

#### React

```tsx
import { useValora } from 'valora/adapters/react';

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

#### Vue

```vue
<script setup>
import { useValora } from 'valora/adapters/vue';

const { validate, errors } = useValora();
</script>

<template>
  <input placeholder="Email" @blur="validate('email', $event.target.value)" />
  <span v-if="errors.email">{{ errors.email }}</span>
</template>
```

## Available Scripts

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

## Project Structure

```
valora/
├── src/
│   ├── core/             # Validation engine & core logic
│   ├── validators/       # Validators (string, number, date, etc.)
│   ├── adapters/         # Framework integrations
│   ├── plugins/          # i18n, logger, cache, transform, devtools
│   ├── schema/           # Schema builder & parser
│   ├── notification/     # Event notification system
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript type definitions
├── tests/                # Test files (unit, integration, e2e)
├── examples/             # Framework-specific examples
├── docs/                 # Documentation
└── dist/                 # Build output (generated)
```

## Validators

### Built-in Categories

- **String** - `email`, `url`, `uuid`, `minLength`, `maxLength`, `pattern`, etc.
- **Number** - `min`, `max`, `between`, `positive`, `integer`, `finite`, etc.
- **Date** - `before`, `after`, `future`, `past`, `weekday`, `age`, etc.
- **Array** - `minLength`, `maxLength`, `unique`, `includes`, `every`, `some`, etc.
- **Object** - `hasKey`, `hasKeys`, `shape`, `strict`, `partial`, etc.
- **Boolean** - `isTrue`, `isFalse`, `required`
- **File** - `maxSize`, `minSize`, `mimeType`, `extension`, `dimensions`
- **Business** - `creditCard`, `phone`, `iban`, `postalCode`, `ssn`, etc.
- **Async** - `unique`, `exists`, `available`, `remote`
- **Logic** - `and`, `or`, `not`, `when`, `unless`, `switch`
- **Comparison** - `equals`, `oneOf`, `equalsField`, `differentFrom`

### Custom Validators

```typescript
import { createValidator } from 'valora/validators/common';

const myValidator = createValidator({
  name: 'myRule',
  validate: (value) => ({
    valid: value.length > 0,
    errors: value.length > 0 ? [] : [{ message: 'Value is required' }],
  }),
});
```

## Plugins

- **i18n** - Multi-language error messages (en, vi, ja, ko, zh, fr, de, es)
- **Logger** - Debug logging for validations
- **Cache** - Cache validation results
- **Transform** - Transform values during validation
- **DevTools** - Developer tools integration

## Type Safety

Valora uses TypeScript strict mode with:

- Explicit return types
- Type-safe validators
- Full path aliases support (`@/`, `@validators/`, etc.)

## Configuration

### Path Aliases

All path aliases are configured in `tsconfig.json` and `vite.config.ts`:

```typescript
import { required } from '@validators/common';
import { deepGet } from '@utils';
import type { ValidationResult } from '@types';
```

### Testing

Tests use Vitest with:

- 70% minimum coverage threshold
- v8 coverage provider
- Type checking enabled
- Both unit and integration tests

## Contributing

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes following the code conventions
3. Run tests: `bun run test`
4. Run linter: `bun run lint:fix`
5. Format code: `bun run format`
6. Commit: `git commit -m "feat: add my feature"`

## Code Conventions

- **Variables/Functions**: `camelCase`
- **Classes/Interfaces/Types**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**: `camelCase.ts` for modules

### TypeScript Best Practices

- Prefer `interface` for object shapes
- Use `type` for unions and utility types
- Import types with `import type {}`
- No `any` types without justification
- Explicit return types on public functions

## Development Setup

1. Install Bun (https://bun.sh)
2. Clone the repository
3. Run `bun install`
4. Run `bun run dev` to start watch mode
5. Check `.claude/CLAUDE.md` for project guidelines

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Validators Guide](./docs/validators.md)
- [Custom Validators](./docs/custom-validators.md)
- [Framework Adapters](./docs/adapters.md)
- [Plugins](./docs/plugins.md)
- [Internationalization](./docs/i18n.md)
- [API Reference](./docs/api-reference.md)

## License

MIT © Valora Team

## Resources

- [Official Website](#) - Coming soon
- [GitHub Issues](https://github.com/TQTuyen/valora/issues)
- [Discussions](#) - Coming soon

---

**Built with TypeScript, Vite, and Vitest**
