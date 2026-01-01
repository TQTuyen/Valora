<template>
  <div class="section">
    <h2>1. Validation Cơ Bản</h2>
    <p>Demo các thao tác validation cơ bản với thông báo lỗi</p>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">
          Email *
          <span v-if="email.isValid.value" class="badge valid">✓ Hợp lệ</span>
          <span v-else-if="email.hasError.value" class="badge invalid">✗ Lỗi</span>
        </label>
        <input
          id="email"
          v-model="email.modelValue.value"
          type="text"
          placeholder="Nhập email của bạn"
          @blur="email.onBlur"
          :class="{ 
            error: email.shouldShowError.value, 
            valid: email.isValid.value && email.touched.value 
          }"
        />
        <div v-if="email.shouldShowError.value" class="error-message">
          {{ email.error.value }}
        </div>
      </div>

      <div class="form-group">
        <label for="age">
          Tuổi *
          <span v-if="age.isValid.value" class="badge valid">✓ Hợp lệ</span>
        </label>
        <input
          id="age"
          v-model.number="age.modelValue.value"
          type="number"
          placeholder="Nhập tuổi (18-100)"
          @blur="age.onBlur"
          :class="{ 
            error: age.shouldShowError.value, 
            valid: age.isValid.value && age.touched.value 
          }"
        />
        <div v-if="age.shouldShowError.value" class="error-message">
          {{ age.error.value }}
        </div>
      </div>

      <div class="form-group">
        <label for="website">Website (Optional)</label>
        <input
          id="website"
          v-model="website.modelValue.value"
          type="text"
          placeholder="https://example.com"
          @blur="website.onBlur"
          :class="{ 
            error: website.shouldShowError.value, 
            valid: website.isValid.value && website.value.value 
          }"
        />
        <div v-if="website.shouldShowError.value" class="error-message">
          {{ website.error.value }}
        </div>
      </div>

      <button type="submit" :disabled="!formState.canSubmit.value">
        Validate & Submit
      </button>
      <button type="button" @click="handleReset" class="secondary">
        Reset Form
      </button>

      <div v-if="submitted" class="success-message" style="margin-top: 1rem;">
        ✓ Form đã được submit thành công!
      </div>
    </form>

    <div class="form-state">
      <strong>Form State:</strong>
      <pre>{{ JSON.stringify({
        isValid: formState.isValid.value,
        touched: formState.touched.value,
        dirty: formState.dirty.value,
        values: getValues()
      }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFormValidation, useFieldValidation } from 'valora/adapters/vue';
import { string, number } from 'valora/validators';

interface BasicForm {
  email: string;
  age: number;
  website?: string;
}

const { adapter, formState, validateAll, resetAll, getValues } = useFormValidation<BasicForm>({
  email: string().email().required(),
  age: number().integer().min(18).max(100).required(),
  website: string().url().optional(),
});

const email = useFieldValidation(adapter, 'email');
const age = useFieldValidation(adapter, 'age');
const website = useFieldValidation(adapter, 'website');

const submitted = ref(false);

const handleSubmit = () => {
  const result = validateAll();
  if (result.success) {
    submitted.value = true;
    alert('Form submitted successfully!\n\n' + JSON.stringify(getValues(), null, 2));
    setTimeout(() => submitted.value = false, 3000);
  }
};

const handleReset = () => {
  resetAll();
  submitted.value = false;
};
</script>
