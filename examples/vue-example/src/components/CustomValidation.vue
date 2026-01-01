<template>
  <div class="section">
    <h2>2. Custom Validation</h2>
    <p>Tạo custom validation rules với logic riêng</p>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">
          Username (Custom: Phải bắt đầu bằng chữ cái, chỉ chứa chữ, số, gạch dưới)
        </label>
        <input
          id="username"
          v-model="username.modelValue.value"
          type="text"
          placeholder="john_doe_123"
          @blur="username.onBlur"
          :class="{ 
            error: username.shouldShowError.value, 
            valid: username.isValid.value && username.touched.value 
          }"
        />
        <div v-if="username.shouldShowError.value" class="error-message">
          {{ username.error.value }}
        </div>
      </div>

      <div class="form-group">
        <label for="password">
          Password (Custom: Ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt)
        </label>
        <input
          id="password"
          v-model="password.modelValue.value"
          type="password"
          placeholder="Nhập mật khẩu mạnh"
          @blur="password.onBlur"
          :class="{ 
            error: password.shouldShowError.value, 
            valid: password.isValid.value && password.touched.value 
          }"
        />
        <div v-if="password.shouldShowError.value">
          <ul class="error-list">
            <li v-for="(msg, idx) in password.errorMessages.value" :key="idx">{{ msg }}</li>
          </ul>
        </div>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword.modelValue.value"
          type="password"
          placeholder="Nhập lại mật khẩu"
          @blur="confirmPassword.onBlur"
          :class="{ 
            error: confirmPassword.shouldShowError.value, 
            valid: confirmPassword.isValid.value && confirmPassword.touched.value 
          }"
        />
        <div v-if="confirmPassword.shouldShowError.value" class="error-message">
          {{ confirmPassword.error.value }}
        </div>
      </div>

      <button type="submit" :disabled="!formState.canSubmit.value">
        Validate Custom Rules
      </button>
      <button type="button" @click="resetAll()" class="secondary">Reset</button>
    </form>

    <div class="form-state">
      <strong>Custom Validation Info:</strong>
      <pre>{{ JSON.stringify({
        allRulesPassed: formState.isValid.value,
        fields: {
          username: { valid: username.isValid.value, touched: username.touched.value },
          password: { valid: password.isValid.value, touched: password.touched.value },
          confirmPassword: { valid: confirmPassword.isValid.value, touched: confirmPassword.touched.value }
        }
      }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormValidation, useFieldValidation } from 'valora/adapters/vue';
import { string } from 'valora/validators';

interface CustomForm {
  username: string;
  password: string;
  confirmPassword: string;
}

const { adapter, formState, validateAll, resetAll } = useFormValidation<CustomForm>({
  // Custom validator cho username - chain multiple custom rules
  username: string()
    .required()
    .minLength(3)
    .maxLength(20)
    .custom(
      (value) => /^[a-zA-Z]/.test(value),
      'Username phải bắt đầu bằng chữ cái'
    )
    .custom(
      (value) => /^[a-zA-Z0-9_]+$/.test(value),
      'Username chỉ được chứa chữ, số và gạch dưới'
    ),

  // Custom validator cho password - chain multiple custom rules
  password: string()
    .required()
    .minLength(8)
    .custom(
      (value) => /[A-Z]/.test(value),
      'Phải có ít nhất 1 chữ hoa'
    )
    .custom(
      (value) => /[a-z]/.test(value),
      'Phải có ít nhất 1 chữ thường'
    )
    .custom(
      (value) => /[0-9]/.test(value),
      'Phải có ít nhất 1 số'
    )
    .custom(
      (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      'Phải có ít nhất 1 ký tự đặc biệt'
    ),

  // Confirm password validator
  confirmPassword: string()
    .required()
    .custom(
      (value) => {
        const passwordValue = adapter.getFieldState('password')?.value;
        return value === passwordValue;
      },
      'Mật khẩu không khớp'
    ),
}, { validationMode: 'onChange' }); // Enable real-time validation

const username = useFieldValidation(adapter, 'username');
const password = useFieldValidation(adapter, 'password');
const confirmPassword = useFieldValidation(adapter, 'confirmPassword');

const handleSubmit = () => {
  const result = validateAll();
  if (result.success) {
    alert('✓ Tất cả custom validation rules đã pass!');
  }
};
</script>
