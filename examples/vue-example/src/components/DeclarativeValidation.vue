<template>
  <div class="section">
    <h2>6. Declarative Validation - Khai Báo Ràng Buộc</h2>

    <div class="feature-grid">
      <div class="feature-card">
        <h4>📝 Schema-Based</h4>
        <p>Định nghĩa tất cả validation rules trong một schema tập trung</p>
        <code>validators: {'{ field: validator() }'}</code>
      </div>

      <div class="feature-card">
        <h4>🔗 Fluent API</h4>
        <p>Chuỗi các validation methods một cách tự nhiên</p>
        <code>string().email().required()</code>
      </div>

      <div class="feature-card">
        <h4>🎯 Type-Safe</h4>
        <p>TypeScript đảm bảo type safety cho form data</p>
        <code>interface FormData {'{ ... }'}</code>
      </div>

      <div class="feature-card">
        <h4>♻️ Reusable</h4>
        <p>Tái sử dụng validators cho nhiều forms</p>
        <code>const emailValidator = ...</code>
      </div>
    </div>

    <h3>Demo Schema Validation</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="productName">Tên Sản Phẩm</label>
        <input
          id="productName"
          v-model="productName.modelValue.value"
          @blur="productName.onBlur"
          :class="{ 
            error: productName.shouldShowError.value, 
            valid: productName.isValid.value && productName.touched.value 
          }"
        />
        <div v-if="productName.shouldShowError.value" class="error-message">
          {{ productName.error.value }}
        </div>
      </div>

      <div class="form-group">
        <label for="price">Giá</label>
        <input
          id="price"
          v-model.number="price.modelValue.value"
          type="number"
          step="0.01"
          @blur="price.onBlur"
          :class="{ 
            error: price.shouldShowError.value, 
            valid: price.isValid.value && price.touched.value 
          }"
        />
        <div v-if="price.shouldShowError.value" class="error-message">
          {{ price.error.value }}
        </div>
      </div>

      <div class="form-group">
        <label for="quantity">Số Lượng</label>
        <input
          id="quantity"
          v-model.number="quantity.modelValue.value"
          type="number"
          @blur="quantity.onBlur"
          :class="{ 
            error: quantity.shouldShowError.value, 
            valid: quantity.isValid.value && quantity.touched.value 
          }"
        />
        <div v-if="quantity.shouldShowError.value" class="error-message">
          {{ quantity.error.value }}
        </div>
      </div>

      <div class="form-group">
        <label for="category">Danh Mục</label>
        <select
          id="category"
          v-model="category.modelValue.value"
          @blur="category.onBlur"
          :class="{ 
            error: category.shouldShowError.value, 
            valid: category.isValid.value && category.touched.value 
          }"
        >
          <option value="">-- Chọn danh mục --</option>
          <option value="electronics">Điện tử</option>
          <option value="clothing">Quần áo</option>
          <option value="books">Sách</option>
          <option value="food">Thực phẩm</option>
        </select>
        <div v-if="category.shouldShowError.value" class="error-message">
          {{ category.error.value }}
        </div>
      </div>

      <div class="form-group">
        <label for="description">Mô Tả</label>
        <textarea
          id="description"
          v-model="description.modelValue.value"
          rows="4"
          @blur="description.onBlur"
          :class="{ 
            error: description.shouldShowError.value, 
            valid: description.isValid.value && description.value.value 
          }"
        ></textarea>
        <div v-if="description.shouldShowError.value" class="error-message">
          {{ description.error.value }}
        </div>
      </div>

      <button type="submit" :disabled="!formState.canSubmit.value">
        Validate Schema
      </button>
      <button type="button" @click="resetAll()" class="secondary">Reset</button>
    </form>

    <div class="form-state">
      <strong>Schema Validation:</strong>
      <pre>{{ JSON.stringify({
        schemaValid: formState.isValid.value,
        validatedBy: 'Declarative Schema',
        approach: 'Type-safe & Composable'
      }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormValidation, useFieldValidation } from 'valora/adapters/vue';
import { string, number } from 'valora/validators';

interface ProductForm {
  productName: string;
  price: number;
  quantity: number;
  category: string;
  description?: string;
}

// Declarative validation schema
const validationSchema = {
  productName: string()
    .required()
    .minLength(3)
    .maxLength(100)
    .notEmpty(),
  
  price: number()
    .required()
    .positive()
    .min(0.01)
    .max(1000000),
  
  quantity: number()
    .required()
    .integer()
    .positive()
    .min(1),
  
  category: string()
    .required()
    .custom(
      (value) => ['electronics', 'clothing', 'books', 'food'].includes(value),
      'Vui lòng chọn danh mục hợp lệ'
    ),
  
  description: string()
    .minLength(10)
    .maxLength(500)
    .optional(),
};

const { adapter, formState, validateAll, resetAll } = useFormValidation<ProductForm>(validationSchema);

const productName = useFieldValidation(adapter, 'productName');
const price = useFieldValidation(adapter, 'price');
const quantity = useFieldValidation(adapter, 'quantity');
const category = useFieldValidation(adapter, 'category');
const description = useFieldValidation(adapter, 'description');

const handleSubmit = () => {
  const result = validateAll();
  if (result.success) {
    alert('✓ Schema validation thành công!');
  }
};
</script>
