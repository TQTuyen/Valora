# Valora Vue Example

Comprehensive demonstration of Valora validation framework integrated with Vue 3, showcasing the full capabilities of the framework in a real-world application context.

## Features Demonstrated

This example showcases a complete implementation of Valora with Vue 3, demonstrating:

### 1. **Vue 3 Composition API Integration**
- Reactive form and field state management
- Automatic lifecycle management with `onBeforeUnmount`
- Type-safe composables (`useFormValidation`, `useFieldValidation`)
- v-model bindings for seamless two-way data binding

### 2. **Complex Validation Rules**
- **Username**: lowercase letters, numbers, underscores, must start with letter
- **Password**: minimum 8 characters, uppercase, lowercase, number, special character
- **Email**: valid email format
- **Phone Number**: Vietnamese phone format (10 digits, specific prefixes)
- **Age**: integer, 18-100 years old
- Custom validation functions with detailed error messages

### 3. **Form State Subscriptions**
- Subscribe to form-level state changes using `adapter.subscribeToForm()`
- Real-time form validity tracking
- Submit button state management based on form state
- Console logging of form state changes for debugging

### 4. **Field-Specific Subscriptions**
- Subscribe to individual field changes using `adapter.subscribeToField()`
- **Password field**: Dynamic hint updates based on validation state
- **Message field**: Real-time character counter (10-500 characters)
- Custom UI updates based on field state

### 5. **Password Strength Indicator**
- Visual strength bar with color-coded levels (weak/medium/strong)
- Real-time strength calculation based on multiple criteria
- Percentage-based visual feedback
- Combines computed properties with field subscriptions

### 6. **Character Counter**
- Real-time character count for textarea fields
- Remaining characters display
- Visual feedback (success/error hints)
- Minimum/maximum length enforcement

### 7. **Multiple Independent Forms**
- **Registration Form**: Comprehensive user registration with 5 fields
- **Contact Form**: Simple contact form with message textarea
- Independent validation states
- Separate submission handlers

### 8. **Toast Notifications**
- Success, error, and info toasts
- Auto-dismiss after 4 seconds
- Animated entrance/exit transitions
- Multiple simultaneous toasts support

### 9. **Success Modal**
- Modal overlay for successful submissions
- Display submitted data in formatted JSON
- Different content for different forms
- Click-outside-to-close functionality

### 10. **Submit Button State Management**
- Button disabled when form is invalid or untouched
- Enabled only when form is valid and touched
- Loading state during submission
- Managed via form state subscriptions

## Installation and Setup

```bash
# Navigate to the example directory
cd examples/vue-example

# Install dependencies
npm install
# or
bun install

# Run development server
npm run dev
# or
bun run dev

# Open browser at http://localhost:5173 (or the port Vite assigns)
```

## Code Examples

### Basic Form Validation

```typescript
import { useFormValidation, useFieldValidation } from 'valora/adapters/vue';
import { string, number } from '@validators/index';

// Define validation schema
const schema = {
  email: string()
    .required({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  age: number()
    .required({ message: 'Age is required' })
    .min(18, { message: 'Must be at least 18' })
};

// Create form validation
const { adapter, formState, validateAll, resetAll } = useFormValidation(schema);

// Create field validations
const email = useFieldValidation(adapter, 'email');
const age = useFieldValidation(adapter, 'age');
```

### Form State Subscriptions

```typescript
// Subscribe to form state changes
adapter.subscribeToForm((state) => {
  console.log('Form is valid:', state.isValid);
  console.log('Form is touched:', state.touched);
  console.log('Error count:', state.errors.length);

  // Update UI based on form state
  canSubmit.value = state.touched && state.isValid;
});
```

### Field-Specific Subscriptions

```typescript
// Subscribe to individual field changes
adapter.subscribeToField('password', (fieldState) => {
  if (fieldState.errors.length > 0) {
    passwordHint.value = fieldState.errors[0]?.message;
  } else if (fieldState.value) {
    passwordHint.value = '✓ Strong password!';
  }
});
```

### Using in Templates

```vue
<template>
  <input
    v-model="email.modelValue.value"
    @blur="email.onBlur"
    :class="{ 'error': email.shouldShowError.value }"
  />
  <div v-if="email.shouldShowError.value">
    <p v-for="msg in email.errorMessages.value" :key="msg">
      {{ msg }}
    </p>
  </div>
</template>
```

## Design Patterns Demonstrated

This example showcases the design patterns used in Valora:

1. **Strategy Pattern** - Interchangeable validation strategies
2. **Chain of Responsibility** - Validation pipeline
3. **Observer Pattern** - Form/field state subscriptions and reactive updates
4. **Decorator Pattern** - Wrapping validators with additional behavior
5. **Adapter Pattern** - Vue adapter converts core API to Vue composables
6. **Factory Pattern** - Creating validators and adapters
7. **Composite Pattern** - Combining multiple validators

## Project Structure

```
vue-example/
├── index.html                      # Entry HTML
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── src/
    ├── main.ts                     # Application entry point
    ├── App.vue                     # Root component
    ├── style.css                   # Global styles
    └── components/
        ├── ComprehensiveDemo.vue   # Main demo component
        └── ComprehensiveDemo.css   # Component styles
```

## Vue Adapter API

### Composables

#### `useFormValidation<T>(validators, options?)`
Main form validation composable that creates a Vue adapter instance with automatic lifecycle management.

**Returns:**
- `adapter` - Vue adapter instance
- `formState` - Reactive form state
- `validateAll()` - Validate all fields
- `resetAll(values?)` - Reset form to initial state
- `getValues()` - Get current form values
- `setValues(values, opts?)` - Set form values

#### `useFieldValidation<T, K>(adapter, field)`
Single field validation composable for reactive field state.

**Returns:**
- All field state refs (value, touched, dirty, errors, isValid, etc.)
- v-model bindings (modelValue, onBlur)
- Helper methods (setValue, touch, reset, validate)

### Reactive State

All form and field states are Vue refs/computed properties that automatically update when data changes:

- **Form State**: `isValid`, `validating`, `touched`, `dirty`, `errors`
- **Field State**: `value`, `touched`, `dirty`, `validating`, `errors`, `isValid`
- **Computed Properties**: `hasError`, `firstError`, `shouldShowError`, `errorMessages`

### v-model Support

The adapter provides `getFieldBindings()` which returns:
- `modelValue` - Computed property for v-model
- `onBlur` - Event handler for blur events
- `error` - First error message
- `hasError` - Boolean for error state
- `shouldShowError` - Boolean for when to show errors
- `errorMessages` - Array of all error messages

### Lifecycle Management

- Automatic subscription cleanup with `onBeforeUnmount`
- Memory leak prevention
- No manual cleanup required

## Debugging

In development mode, the example exposes adapter instances globally:

```javascript
// In browser console
window.registrationAdapter.getFormState()
window.registrationAdapter.getFieldState('email')
window.registrationAdapter.validateAll()
window.contactAdapter.getValues()
window.toggleDebug()  // Toggle form state debug view
```
