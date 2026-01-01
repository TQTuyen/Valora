# Valora Documentation

**Production-grade TypeScript-first validation framework with class-validator style decorators**

## 📚 Documentation Overview

This documentation covers everything you need to know about Valora, from basic usage to advanced patterns.

### Quick Links

- **[Getting Started](./getting-started.md)** - Installation and first steps
- **[Decorators Guide](./decorators-guide.md)** - Complete decorator system reference
- **[Validators Guide](./validators-guide.md)** - Fluent validator API
- **[Nested Validation](./nested-validation.md)** - Working with nested objects
- **[Advanced Usage](./advanced-usage.md)** - Custom validators, error handling, i18n
- **[Examples](./examples.md)** - Real-world use cases
- **[API Reference](./api-reference.md)** - Complete API documentation
- **[Migration Guide](./migration-guide.md)** - Upgrading from legacy decorators

## 🎯 What is Valora?

Valora is a production-grade validation framework for TypeScript that offers:

- **🎨 Class-Validator Style Decorators** - Familiar, elegant validation syntax
- **🔗 Fluent Chainable API** - `v.string().email().minLength(5)`
- **🌳 Tree-Shakeable** - Import only what you need
- **🏗️ SOLID Architecture** - 6 GoF design patterns (Strategy, Chain of Responsibility, Observer, Factory, Decorator, Composite)
- **🌍 i18n Support** - English & Vietnamese built-in, extensible
- **🔒 Type-Safe** - Full TypeScript inference with `Infer<T>`
- **⚡ Production-Ready** - Comprehensive test coverage

## 🚀 Quick Example

### Using Decorators (Recommended)

```typescript
import { Validate, IsString, IsEmail, MinLength, Min } from '@tqtos/valora/decorators';

@Validate()
class User {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @Min(0)
  age: number;
}

// Auto-validates on construction!
const user = new User({
  name: 'John',
  email: 'john@example.com',
  age: 25,
});
```

### Using Fluent API

```typescript
import { v, Infer } from '@tqtos/valora';

const userSchema = v.object({
  name: v.string().minLength(2),
  email: v.string().email(),
  age: v.number().min(0).optional(),
});

type User = Infer<typeof userSchema>;

const result = userSchema.validate(data);
if (result.success) {
  console.log(result.data); // Fully typed!
}
```

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

## 🎓 Learning Path

1. **Beginners:** Start with [Getting Started](./getting-started.md)
2. **Decorator Users:** Read [Decorators Guide](./decorators-guide.md)
3. **Fluent API Users:** Read [Validators Guide](./validators-guide.md)
4. **Advanced Users:** Explore [Advanced Usage](./advanced-usage.md)

## 🤝 Contributing

Contributions are welcome! Please see our contributing guidelines.

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/TQTuyen/Valora)
- [NPM Package](https://www.npmjs.com/package/@tqtos/valora)
- [Issue Tracker](https://github.com/TQTuyen/Valora/issues)
