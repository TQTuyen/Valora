# Valora - Modern Validation Framework

## Project Overview

Valora is a modern, tree-shakeable validation framework for JavaScript/TypeScript with framework adapters for React, Vue, Svelte, Solid, and Vanilla JS.

---

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript (strict mode)
- **Build**: Vite with vite-plugin-dts
- **Testing**: Vitest with v8 coverage
- **Linting**: ESLint 9 (flat config)
- **Formatting**: Prettier

---

## CLI Tool Requirements

**Always use modern CLI tools:**

| Instead of      | Use            |
| --------------- | -------------- |
| `find`          | `fd`           |
| `ls`            | `eza`          |
| `grep`          | `rg` (ripgrep) |
| `npm/yarn/pnpm` | `bun`          |
| JSON parsing    | `jq`           |

### Examples

```bash
# Find TypeScript files
fd -e ts -e tsx src/

# List files with details
eza -la --git

# Tree view
eza --tree --level=3 src/

# Search for pattern
rg "ValidationRule" src/

# Search specific file types
rg --type ts "export.*function" src/

# Parse package.json
jq '.scripts' package.json

# Find validators
fd "\.ts$" src/validators/
```

---

## Project Structure

```
valora/
├── src/
│   ├── index.ts              # Main entry
│   ├── core/                  # ValidationEngine, executor, context, config, result
│   ├── notification/          # NotificationHub, emitter, event types
│   ├── validators/            # Tree-shakeable validators
│   │   ├── string/           # email, minLength, maxLength, pattern, url, uuid...
│   │   ├── number/           # min, max, between, positive, integer...
│   │   ├── date/             # before, after, future, past, age...
│   │   ├── array/            # minLength, unique, every, some...
│   │   ├── object/           # hasKey, shape, strict, partial...
│   │   ├── boolean/          # isTrue, isFalse, required
│   │   ├── file/             # maxSize, mimeType, extension, dimensions
│   │   ├── business/         # creditCard, phone, iban, postalCode...
│   │   ├── async/            # unique, exists, available, remote
│   │   ├── logic/            # and, or, not, when, unless, switch
│   │   ├── comparison/       # equals, oneOf, equalsField...
│   │   └── common/           # required, optional, nullable, custom
│   ├── adapters/              # Framework adapters
│   │   ├── react/            # useValidateX, useFieldValidation, Provider
│   │   ├── vue/              # composables, plugin
│   │   ├── svelte/           # stores
│   │   ├── solid/            # signals
│   │   └── vanilla/          # DOM binding
│   ├── plugins/               # Extensible plugins
│   │   ├── i18n/             # Internationalization with locales
│   │   ├── logger/           # Debug logging
│   │   ├── cache/            # Result caching
│   │   ├── transform/        # Value transformation
│   │   └── devtools/         # Developer tools
│   ├── schema/                # Schema builder & parser
│   ├── utils/                 # debounce, throttle, deepGet, deepSet...
│   └── types/                 # TypeScript type definitions
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── examples/                  # Framework examples
├── docs/                      # Documentation
└── scripts/                   # Build scripts
```

---

## Commands

```bash
# Development
bun run dev              # Watch mode build
bun run build            # Production build
bun run typecheck        # Type check

# Testing
bun run test             # Watch mode
bun run test:run         # Run once
bun run test:coverage    # With coverage

# Code Quality
bun run lint             # ESLint check
bun run lint:fix         # ESLint fix
bun run format           # Prettier format
bun run format:check     # Prettier check
```

---

## Path Aliases

Available in both TypeScript and Vite:

| Alias             | Path                 |
| ----------------- | -------------------- |
| `@/*`             | `src/*`              |
| `@core/*`         | `src/core/*`         |
| `@validators/*`   | `src/validators/*`   |
| `@notification/*` | `src/notification/*` |
| `@adapters/*`     | `src/adapters/*`     |
| `@plugins/*`      | `src/plugins/*`      |
| `@schema/*`       | `src/schema/*`       |
| `@utils/*`        | `src/utils/*`        |
| `@types/*`        | `src/types/*`        |

---

## Code Conventions

### Naming

- **Variables/functions**: `camelCase`
- **Classes/interfaces/types**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**: `camelCase.ts` for modules, `PascalCase.tsx` for components

### TypeScript

- Use `interface` for object shapes
- Use `type` for unions and utility types
- Prefer type imports: `import type { Foo } from './foo'`
- No `any` without justification
- Explicit return types on public functions

### Validators

- Each validator is a standalone function
- Return `ValidationResult` type
- Support async validators with `Promise<ValidationResult>`
- Tree-shakeable by design

### Testing

- Test files: `*.test.ts` or `*.spec.ts`
- Co-locate tests with source or in `tests/` directory
- Minimum 70% coverage threshold

---

## Architecture Principles

1. **Tree-shakeable**: Import only what you need
2. **Framework agnostic**: Core works everywhere
3. **Type-safe**: Full TypeScript support
4. **Extensible**: Plugin system for customization
5. **Performant**: Lazy evaluation, caching support
6. **i18n ready**: Built-in internationalization

---

## Key Types (to implement)

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  value?: unknown;
}

interface ValidationError {
  path: string;
  message: string;
  rule: string;
  params?: Record<string, unknown>;
}

interface ValidationRule<T = unknown> {
  name: string;
  validate: (value: T, context: ValidationContext) => ValidationResult | Promise<ValidationResult>;
  message?: string | ((params: Record<string, unknown>) => string);
}

interface ValidationContext {
  path: string;
  root: unknown;
  parent?: unknown;
  siblings?: Record<string, unknown>;
}
```

---

## When to Ask for Clarification

- Changing core validation engine architecture
- Modifying public API contracts
- Adding new framework adapters
- Changing plugin interface
- Performance-critical changes
