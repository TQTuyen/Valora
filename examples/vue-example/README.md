# Valora Vue Example

Demo đầy đủ các tính năng của Valora validation framework cho Vue 3.

## Các Tính Năng Demo

### 1. **Basic Validation** - Validation Cơ Bản
- Validation email, number, URL
- Hiển thị thông báo lỗi inline
- Badge hiển thị trạng thái valid/invalid

### 2. **Custom Validation** - Validation Tùy Chỉnh
- Tạo custom validation rules
- Logic validation phức tạp
- Password matching
- Username format validation

### 3. **Combined Validators** - Kết Hợp Validators
- Kết hợp nhiều rules cho một field
- String: required + minLength + maxLength + pattern
- Number: integer + min + max + multipleOf

### 4. **Regular Expression** - Regex Validation
- Zip code pattern
- IPv4 address validation
- Credit card format
- Hex color code
- URL slug validation

### 5. **Complex Form** - Form Phức Tạp
- Form đăng ký đầy đủ
- Nhiều loại input (text, number, select, textarea, checkbox)
- Validation rules phức tạp
- Form progress tracking

### 6. **Declarative Validation** - Khai Báo Schema
- Schema-based validation
- Type-safe với TypeScript
- Fluent API
- Reusable validators

### 7. **Real-time Validation** - Thông Báo Thời Gian Thực
- Live character count
- Password strength indicator
- Auto-format phone number
- Multiple error display styles
- onChange validation mode

## Cài Đặt và Chạy

```bash
# Di chuyển vào thư mục example
cd examples/vue-example

# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev

# Mở trình duyệt tại http://localhost:3000
```

## Design Patterns Được Sử Dụng

Trong Valora validation framework và Vue adapter:

1. **Strategy Pattern** - Các validation strategies có thể hoán đổi
2. **Chain of Responsibility** - Chuỗi validation pipeline
3. **Observer Pattern** - Form state subscriptions và reactive updates
4. **Decorator Pattern** - Wrapping validators với additional behavior
5. **Adapter Pattern** - Vue adapter chuyển đổi core API sang Vue composables
6. **Factory Pattern** - Tạo validators và adapters
7. **Composite Pattern** - Kết hợp nhiều validators

## Cấu Trúc Thư Mục

```
vue-example/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.ts
    ├── App.vue
    ├── style.css
    └── components/
        ├── BasicValidation.vue
        ├── CustomValidation.vue
        ├── CombinedValidators.vue
        ├── RegexValidation.vue
        ├── ComplexForm.vue
        ├── DeclarativeValidation.vue
        └── RealtimeValidation.vue
```

## Vue Adapter Features

### Composables
- `useFormValidation()` - Main form validation composable
- `useFieldValidation()` - Single field validation composable

### Reactive State
- Tất cả form và field states là Vue refs/computed
- Tự động update khi có thay đổi
- Type-safe với TypeScript

### v-model Support
- `getFieldBindings()` cung cấp modelValue và event handlers
- Tích hợp dễ dàng với v-model directive

### Lifecycle Management
- Auto cleanup subscriptions với `onBeforeUnmount`
- Memory leak prevention
