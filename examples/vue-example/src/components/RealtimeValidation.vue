<template>
  <div class="section">
    <h2>7. Real-time Validation - Thông Báo Theo Thời Gian Thực</h2>
    <p>Validation ngay lập tức khi người dùng nhập liệu với các cách hiển thị khác nhau</p>

    <form @submit.prevent="handleSubmit">
      <!-- Inline error display -->
      <div class="form-group">
        <label for="rtEmail">
          Email (Inline Error Display)
          <span v-if="email.validating.value" class="badge validating">⏳ Validating...</span>
          <span v-else-if="email.isValid.value && email.value.value" class="badge valid">✓</span>
          <span v-else-if="email.hasError.value && email.touched.value" class="badge invalid">✗</span>
        </label>
        <input
          id="rtEmail"
          v-model="email.modelValue.value"
          type="text"
          @blur="email.onBlur"
          :class="{ 
            error: email.shouldShowError.value, 
            valid: email.isValid.value && email.value.value 
          }"
        />
        <div v-if="email.shouldShowError.value" class="error-message">
          {{ email.error.value }}
        </div>
      </div>

      <!-- Live character count -->
      <div class="form-group">
        <label for="rtMessage">
          Message (Live Character Count)
          <span style="opacity: 0.7; font-size: 0.9em;">
            ({{ messageLength }}/{{ maxMessageLength }} ký tự)
          </span>
        </label>
        <textarea
          id="rtMessage"
          v-model="message.modelValue.value"
          rows="4"
          @blur="message.onBlur"
          :class="{ 
            error: message.shouldShowError.value, 
            valid: message.isValid.value && message.value.value 
          }"
        ></textarea>
        <div v-if="message.shouldShowError.value" class="error-message">
          {{ message.error.value }}
        </div>
        <div v-else-if="messageLength > 0" style="font-size: 0.875rem; opacity: 0.7; margin-top: 0.25rem;">
          Còn lại {{ maxMessageLength - messageLength }} ký tự
        </div>
      </div>

      <!-- Password strength indicator -->
      <div class="form-group">
        <label for="rtPassword">
          Password (Strength Indicator)
          <span v-if="passwordStrength" :class="`badge ${passwordStrengthClass}`">
            {{ passwordStrength }}
          </span>
        </label>
        <input
          id="rtPassword"
          v-model="password.modelValue.value"
          type="password"
          @blur="password.onBlur"
          :class="{ 
            error: password.shouldShowError.value, 
            valid: password.isValid.value && password.value.value 
          }"
        />
        <div v-if="password.shouldShowError.value">
          <ul class="error-list">
            <li v-for="(msg, idx) in password.errorMessages.value" :key="idx">{{ msg }}</li>
          </ul>
        </div>
        <div v-else-if="password.value.value" style="margin-top: 0.5rem;">
          <div style="display: flex; gap: 0.25rem;">
            <div
              v-for="i in 4"
              :key="i"
              :style="{
                height: '4px',
                flex: 1,
                borderRadius: '2px',
                background: i <= strengthLevel ? strengthColor : 'rgba(255,255,255,0.1)'
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Real-time format validation -->
      <div class="form-group">
        <label for="rtPhone">
          Phone (Auto-format & Validate)
          <span v-if="phone.isValid.value && phone.value.value" class="badge valid">✓ Valid</span>
        </label>
        <input
          id="rtPhone"
          v-model="phone.modelValue.value"
          type="text"
          @blur="phone.onBlur"
          placeholder="0123456789"
          :class="{ 
            error: phone.shouldShowError.value, 
            valid: phone.isValid.value && phone.value.value 
          }"
        />
        <div v-if="phone.shouldShowError.value" class="error-message">
          {{ phone.error.value }}
        </div>
        <div v-else-if="phone.value.value" style="font-size: 0.875rem; opacity: 0.7; margin-top: 0.25rem;">
          Format: {{ formatPhone(phone.value.value) }}
        </div>
      </div>

      <!-- Multiple error display styles -->
      <div class="form-group">
        <label for="rtUsername">Username (Multiple Error Display)</label>
        <input
          id="rtUsername"
          v-model="username.modelValue.value"
          type="text"
          @blur="username.onBlur"
          :class="{ 
            error: username.shouldShowError.value, 
            valid: username.isValid.value && username.value.value 
          }"
        />
        <!-- Show all errors at once -->
        <div v-if="username.shouldShowError.value && username.errorMessages.value.length > 0">
          <ul class="error-list">
            <li v-for="(msg, idx) in username.errorMessages.value" :key="idx">{{ msg }}</li>
          </ul>
        </div>
      </div>

      <button type="submit" :disabled="!formState.canSubmit.value">
        Submit Real-time Validated Form
      </button>
      <button type="button" @click="resetAll()" class="secondary">Reset</button>
    </form>

    <div class="form-state">
      <strong>Real-time Validation State:</strong>
      <pre>{{ JSON.stringify({
        formValid: formState.isValid.value,
        formTouched: formState.touched.value,
        formDirty: formState.dirty.value,
        liveValidation: 'onChange',
        errorDisplay: 'Multiple Styles'
      }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFormValidation, useFieldValidation } from 'valora/adapters/vue';
import { string } from 'valora/validators';

interface RealtimeForm {
  email: string;
  message: string;
  password: string;
  phone: string;
  username: string;
}

const maxMessageLength = 200;

const { adapter, formState, validateAll, resetAll } = useFormValidation<RealtimeForm>({
  email: string().required().email(),
  
  message: string()
    .required()
    .minLength(10)
    .maxLength(maxMessageLength),
  
  password: string()
    .required()
    .minLength(8)
    .custom((value) => /[A-Z]/.test(value), 'Thiếu chữ hoa')
    .custom((value) => /[a-z]/.test(value), 'Thiếu chữ thường')
    .custom((value) => /[0-9]/.test(value), 'Thiếu số')
    .custom((value) => /[!@#$%^&*]/.test(value), 'Thiếu ký tự đặc biệt'),
  
  phone: string()
    .required()
    .numeric()
    .length(10),
  
  username: string()
    .required()
    .minLength(3)
    .maxLength(20)
    .custom(
      (value) => /^[a-zA-Z]/.test(value),
      'Phải bắt đầu bằng chữ cái'
    )
    .custom(
      (value) => /^[a-zA-Z0-9_]+$/.test(value),
      'Chỉ chứa chữ, số, gạch dưới'
    ),
}, { validationMode: 'onChange' });

const email = useFieldValidation(adapter, 'email');
const message = useFieldValidation(adapter, 'message');
const password = useFieldValidation(adapter, 'password');
const phone = useFieldValidation(adapter, 'phone');
const username = useFieldValidation(adapter, 'username');

// Live character count
const messageLength = computed(() => message.value.value?.length || 0);

// Password strength
const passwordStrength = computed(() => {
  const pwd = password.value.value;
  if (!pwd) return '';
  
  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (/[A-Z]/.test(pwd)) strength++;
  if (/[a-z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd)) strength++;
  if (/[!@#$%^&*]/.test(pwd)) strength++;
  
  if (strength <= 2) return 'Yếu';
  if (strength === 3) return 'Trung bình';
  if (strength === 4) return 'Mạnh';
  return 'Rất mạnh';
});

const strengthLevel = computed(() => {
  const pwd = password.value.value;
  if (!pwd) return 0;
  
  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (/[A-Z]/.test(pwd)) strength++;
  if (/[a-z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd)) strength++;
  if (/[!@#$%^&*]/.test(pwd)) strength++;
  
  return strength > 4 ? 4 : strength;
});

const strengthColor = computed(() => {
  const level = strengthLevel.value;
  if (level <= 2) return '#ef4444';
  if (level === 3) return '#f59e0b';
  return '#10b981';
});

const passwordStrengthClass = computed(() => {
  const level = strengthLevel.value;
  if (level <= 2) return 'invalid';
  if (level === 3) return 'validating';
  return 'valid';
});

// Phone formatter
const formatPhone = (phone: string) => {
  if (!phone) return '';
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3');
};

const handleSubmit = () => {
  const result = validateAll();
  if (result.success) {
    alert('✓ Real-time validation thành công!');
  }
};
</script>
