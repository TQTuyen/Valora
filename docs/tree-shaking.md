# Tree-Shaking Guide

## Overview

Valora is **fully optimized for tree-shaking**, meaning bundlers can automatically eliminate unused code, resulting in smaller bundle sizes. This guide explains how to take advantage of this optimization.

## What is Tree-Shaking?

Tree-shaking is dead code elimination for JavaScript. When you import only specific parts of a library, modern bundlers (Webpack, Rollup, Vite, esbuild) can remove unused code from your final bundle.

## How Valora Supports Tree-Shaking

### 1. ES Modules
All code is built as ES modules (ESM), which is required for tree-shaking:
```typescript
// Valora uses
export { string } from './validator';

// NOT
module.exports = { string };
```

### 2. Named Exports
Every export uses named exports (no default exports):
```typescript
// ✅ Tree-shakeable
import { string, number } from '@tqtos/valora';

// ❌ Not tree-shakeable
import valora from '@tqtos/valora'; // Valora doesn't use default exports
```

### 3. No Side Effects
The package declares `"sideEffects": false`, telling bundlers that importing a module won't cause any side effects:
```json
{
  "sideEffects": false
}
```

### 4. Preserved Module Structure
The build preserves the original module structure, allowing granular imports:
```
dist/validators/string/index.js
dist/validators/number/index.js
dist/decorators/property/index.js
```

## Import Strategies

### Strategy 1: Main Entry Point (Recommended for Most Cases)
```typescript
import { string, number, v } from '@tqtos/valora';

// ✅ Tree-shaking works - only string and number are bundled
const schema = v.object({
  name: string().minLength(2),
  age: number().min(0),
});
```

**Bundle impact**: Only the validators you use (~2-5 KB per validator)

### Strategy 2: Category-Specific Imports (Most Granular)
```typescript
import { string } from '@tqtos/valora/validators/string';
import { number } from '@tqtos/valora/validators/number';

// ✅ Maximum tree-shaking - only specific validators
```

**Bundle impact**: Minimal (~2-3 KB per validator)

### Strategy 3: Decorator Imports
```typescript
import { IsString, IsEmail, MinLength } from '@tqtos/valora/decorators';

class UserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;
}
```

**Bundle impact**: ~1-2 KB per decorator

### Strategy 4: Plugin Imports
```typescript
import { pipe, compose, memoize } from '@tqtos/valora/plugins/transform';

const transform = pipe(
  trim,
  lowercase,
  slugify
);
```

**Bundle impact**: ~0.5-1 KB per function

## Bundle Size Comparison

Example bundle sizes (minified + gzipped):

| Import Style | Bundle Size | What's Included |
|-------------|-------------|-----------------|
| Single validator | ~2 KB | Just `string()` |
| 3 validators | ~5 KB | `string()`, `number()`, `date()` |
| Full schema builder | ~8 KB | Schema builder + used validators |
| With decorators | +1-2 KB | Each decorator adds minimal overhead |
| Entire library | ~50 KB | Everything (only if you import everything) |

## Verification

### Check Your Bundle Size

#### With Webpack
```bash
npm run build -- --analyze
```

#### With Rollup/Vite
```bash
vite build --mode production
# Check dist/ output sizes
```

#### With Next.js
```bash
npm run build
# Webpack bundle analyzer is built-in
```

### Example Test

Create a minimal test file:

```typescript
// test.ts
import { string } from '@tqtos/valora';

const validator = string().email();
console.log(validator.validate('test@example.com'));
```

Build this with your bundler and check the output size. It should be ~2-3 KB (minified + gzipped), not 50+ KB.

## Best Practices

### ✅ DO

```typescript
// Import only what you need
import { string, number } from '@tqtos/valora';

// Use specific paths for maximum optimization
import { string } from '@tqtos/valora/validators/string';

// Import types separately (they're stripped in builds)
import type { ValidationResult } from '@tqtos/valora';
```

### ❌ DON'T

```typescript
// Avoid namespace imports (imports everything)
import * as valora from '@tqtos/valora';
const schema = valora.string();

// Avoid re-exporting entire module
export * from '@tqtos/valora'; // Re-exports everything
```

## Framework-Specific Tips

### React
```typescript
import { string, number } from '@tqtos/valora';
import { useFormState } from '@tqtos/valora/adapters/react'; // When available

// Tree-shaking works automatically with Create React App, Next.js, Vite
```

### Vue
```typescript
import { string, number } from '@tqtos/valora';

// Works with Vue CLI, Vite, Nuxt
```

### Angular
```typescript
import { string, number } from '@tqtos/valora';

// Angular CLI uses Webpack with tree-shaking enabled by default
```

### Svelte/SvelteKit
```typescript
import { string, number } from '@tqtos/valora';

// Vite-based, excellent tree-shaking by default
```

## TypeScript Integration

TypeScript types are automatically included and don't affect bundle size:

```typescript
import { string } from '@tqtos/valora';
import type { StringValidator, ValidationResult } from '@tqtos/valora';

// Types are stripped at compile time - zero runtime cost
const validator: StringValidator = string();
const result: ValidationResult<string> = validator.validate('test');
```

## Troubleshooting

### "My bundle is still large"

1. **Check imports**: Make sure you're not using `import *`
2. **Verify production mode**: Tree-shaking only works in production builds
3. **Check your bundler config**: Ensure tree-shaking is enabled
4. **Use bundle analyzer**: Tools like `webpack-bundle-analyzer` show what's included

### "Tree-shaking not working"

Ensure your bundler is configured correctly:

```javascript
// webpack.config.js
module.exports = {
  mode: 'production', // Required
  optimization: {
    usedExports: true, // Enable tree-shaking
  },
};
```

```javascript
// vite.config.ts
export default {
  build: {
    minify: 'terser', // or 'esbuild'
  },
};
```

## Summary

Valora is **optimized for tree-shaking out of the box**. Simply:

1. ✅ Import only what you need
2. ✅ Use named imports
3. ✅ Build in production mode
4. ✅ Your bundler handles the rest

**Result**: Minimal bundle sizes, faster load times, better user experience.
