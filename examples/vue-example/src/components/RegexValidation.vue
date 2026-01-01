<template>
  <div class="section">
    <h2>4. Regular Expression Validation</h2>
    <p>Sử dụng regex patterns để validate dữ liệu</p>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="zipCode">
          Mã Bưu Điện (Regex: 5 chữ số)
        </label>
        <input
          id="zipCode"
          v-model="zipCode.modelValue.value"
          type="text"
          placeholder="12345"
          @blur="zipCode.onBlur"
          :class="{ 
            error: zipCode.shouldShowError.value, 
            valid: zipCode.isValid.value && zipCode.touched.value 
          }"
        />
        <div v-if="zipCode.shouldShowError.value" class="error-message">
          {{ zipCode.error.value }}
        </div>
        <small style="opacity: 0.7;">Pattern: <code>^\d{5}$</code></small>
      </div>

      <div class="form-group">
        <label for="ipAddress">
          Địa Chỉ IP (Regex: IPv4 format)
        </label>
        <input
          id="ipAddress"
          v-model="ipAddress.modelValue.value"
          type="text"
          placeholder="192.168.1.1"
          @blur="ipAddress.onBlur"
          :class="{ 
            error: ipAddress.shouldShowError.value, 
            valid: ipAddress.isValid.value && ipAddress.touched.value 
          }"
        />
        <div v-if="ipAddress.shouldShowError.value" class="error-message">
          {{ ipAddress.error.value }}
        </div>
        <small style="opacity: 0.7;">Pattern: IPv4 address</small>
      </div>

      <div class="form-group">
        <label for="creditCard">
          Số Thẻ Tín Dụng (Regex: 16 chữ số, có thể có dấu cách hoặc gạch ngang)
        </label>
        <input
          id="creditCard"
          v-model="creditCard.modelValue.value"
          type="text"
          placeholder="1234-5678-9012-3456"
          @blur="creditCard.onBlur"
          :class="{ 
            error: creditCard.shouldShowError.value, 
            valid: creditCard.isValid.value && creditCard.touched.value 
          }"
        />
        <div v-if="creditCard.shouldShowError.value" class="error-message">
          {{ creditCard.error.value }}
        </div>
        <small style="opacity: 0.7;">Format: XXXX-XXXX-XXXX-XXXX hoặc XXXXXXXXXXXXXXXX</small>
      </div>

      <div class="form-group">
        <label for="hexColor">
          Mã Màu Hex (Regex: #RRGGBB hoặc #RGB)
        </label>
        <input
          id="hexColor"
          v-model="hexColor.modelValue.value"
          type="text"
          placeholder="#FF5733 hoặc #F57"
          @blur="hexColor.onBlur"
          :class="{ 
            error: hexColor.shouldShowError.value, 
            valid: hexColor.isValid.value && hexColor.touched.value 
          }"
        />
        <div v-if="hexColor.shouldShowError.value" class="error-message">
          {{ hexColor.error.value }}
        </div>
        <small style="opacity: 0.7;">Pattern: <code>^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$</code></small>
      </div>

      <div class="form-group">
        <label for="slugUrl">
          URL Slug (Regex: chữ thường, số, gạch ngang)
        </label>
        <input
          id="slugUrl"
          v-model="slugUrl.modelValue.value"
          type="text"
          placeholder="my-awesome-blog-post-2024"
          @blur="slugUrl.onBlur"
          :class="{ 
            error: slugUrl.shouldShowError.value, 
            valid: slugUrl.isValid.value && slugUrl.touched.value 
          }"
        />
        <div v-if="slugUrl.shouldShowError.value" class="error-message">
          {{ slugUrl.error.value }}
        </div>
        <small style="opacity: 0.7;">Pattern: <code>^[a-z0-9]+(?:-[a-z0-9]+)*$</code></small>
      </div>

      <button type="submit" :disabled="!formState.canSubmit.value">
        Validate Regex Patterns
      </button>
      <button type="button" @click="resetAll()" class="secondary">Reset</button>
    </form>

    <div class="form-state">
      <strong>Regex Validation Status:</strong>
      <pre>{{ JSON.stringify({
        allPassed: formState.isValid.value,
        fields: {
          zipCode: zipCode.isValid.value,
          ipAddress: ipAddress.isValid.value,
          creditCard: creditCard.isValid.value,
          hexColor: hexColor.isValid.value,
          slugUrl: slugUrl.isValid.value
        }
      }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormValidation, useFieldValidation } from 'valora/adapters/vue';
import { string } from 'valora/validators';

interface RegexForm {
  zipCode: string;
  ipAddress: string;
  creditCard: string;
  hexColor: string;
  slugUrl: string;
}

const { adapter, formState, validateAll, resetAll } = useFormValidation<RegexForm>({
  // Mã bưu điện: 5 chữ số
  zipCode: string()
    .required()
    .pattern(/^\d{5}$/, 'Mã bưu điện phải là 5 chữ số'),

  // IPv4 address
  ipAddress: string()
    .required()
    .pattern(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Địa chỉ IP không hợp lệ'
    ),

  // Credit card: 16 chữ số với hoặc không có dấu phân cách
  creditCard: string()
    .required()
    .pattern(
      /^(?:\d{4}[-\s]?){3}\d{4}$/,
      'Số thẻ phải có 16 chữ số (có thể có dấu - hoặc khoảng trắng)'
    ),

  // Hex color code
  hexColor: string()
    .required()
    .pattern(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      'Mã màu hex không hợp lệ (ví dụ: #FF5733 hoặc #F57)'
    ),

  // URL slug
  slugUrl: string()
    .required()
    .pattern(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug chỉ được chứa chữ thường, số và gạch ngang'
    ),
});

const zipCode = useFieldValidation(adapter, 'zipCode');
const ipAddress = useFieldValidation(adapter, 'ipAddress');
const creditCard = useFieldValidation(adapter, 'creditCard');
const hexColor = useFieldValidation(adapter, 'hexColor');
const slugUrl = useFieldValidation(adapter, 'slugUrl');

const handleSubmit = () => {
  const result = validateAll();
  if (result.success) {
    alert('✓ Tất cả regex patterns đã pass!');
  }
};
</script>
