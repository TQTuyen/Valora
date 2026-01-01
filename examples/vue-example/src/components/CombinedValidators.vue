<template>
  <div class="section">
    <h2>3. Kết Hợp Nhiều Validators</h2>
    <p>Demo kết hợp nhiều validation rules cho cùng một field</p>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="fullName">
          Họ và Tên (Kết hợp: required + minLength + maxLength + alpha)
        </label>
        <input
          id="fullName"
          v-model="fullName.modelValue.value"
          type="text"
          placeholder="Nguyễn Văn A"
          @blur="fullName.onBlur"
          :class="{ 
            error: fullName.shouldShowError.value, 
            valid: fullName.isValid.value && fullName.touched.value 
          }"
        />
        <div v-if="fullName.shouldShowError.value" class="error-message">
          {{ fullName.error.value }}
        </div>
        <small style="opacity: 0.7;">
          • Bắt buộc • Ít nhất 3 ký tự • Tối đa 50 ký tự • Chỉ chữ cái và khoảng trắng
        </small>
      </div>

      <div class="form-group">
        <label for="phoneNumber">
          Số Điện Thoại (Kết hợp: required + numeric + length)
        </label>
        <input
          id="phoneNumber"
          v-model="phoneNumber.modelValue.value"
          type="text"
          placeholder="0123456789"
          @blur="phoneNumber.onBlur"
          :class="{ 
            error: phoneNumber.shouldShowError.value, 
            valid: phoneNumber.isValid.value && phoneNumber.touched.value 
          }"
        />
        <div v-if="phoneNumber.shouldShowError.value" class="error-message">
          {{ phoneNumber.error.value }}
        </div>
        <small style="opacity: 0.7;">• Bắt buộc • Chỉ số • Đúng 10 chữ số</small>
      </div>

      <div class="form-group">
        <label for="bio">
          Giới Thiệu (Kết hợp: optional + minLength + maxLength + notEmpty)
        </label>
        <textarea
          id="bio"
          v-model="bio.modelValue.value"
          rows="4"
          placeholder="Viết vài dòng về bản thân..."
          @blur="bio.onBlur"
          :class="{ 
            error: bio.shouldShowError.value, 
            valid: bio.isValid.value && bio.value.value 
          }"
        ></textarea>
        <div v-if="bio.shouldShowError.value" class="error-message">
          {{ bio.error.value }}
        </div>
        <small style="opacity: 0.7;">
          • Không bắt buộc • Nếu có thì ít nhất 10 ký tự • Tối đa 500 ký tự • Không được rỗng
        </small>
      </div>

      <div class="form-group">
        <label for="score">
          Điểm Số (Kết hợp: required + integer + min + max + multipleOf)
        </label>
        <input
          id="score"
          v-model.number="score.modelValue.value"
          type="number"
          placeholder="0, 5, 10, 15, ..."
          @blur="score.onBlur"
          :class="{ 
            error: score.shouldShowError.value, 
            valid: score.isValid.value && score.touched.value 
          }"
        />
        <div v-if="score.shouldShowError.value" class="error-message">
          {{ score.error.value }}
        </div>
        <small style="opacity: 0.7;">• Số nguyên • Từ 0-100 • Phải chia hết cho 5</small>
      </div>

      <button type="submit" :disabled="!formState.canSubmit.value">
        Validate Combined Rules
      </button>
      <button type="button" @click="resetAll()" class="secondary">Reset</button>
    </form>

    <div class="form-state">
      <strong>Validation Status:</strong>
      <pre>{{ JSON.stringify({
        formValid: formState.isValid.value,
        individualFields: {
          fullName: fullName.isValid.value,
          phoneNumber: phoneNumber.isValid.value,
          bio: bio.isValid.value,
          score: score.isValid.value
        }
      }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormValidation, useFieldValidation } from 'valora/adapters/vue';
import { string, number } from 'valora/validators';

interface CombinedForm {
  fullName: string;
  phoneNumber: string;
  bio?: string;
  score: number;
}

const { adapter, formState, validateAll, resetAll } = useFormValidation<CombinedForm>({
  // Kết hợp nhiều validators cho fullName
  fullName: string()
    .required()
    .minLength(3)
    .maxLength(50)
    .custom(
      (value) => /^[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/.test(value),
      'Chỉ được chứa chữ cái và khoảng trắng'
    ),

  // Kết hợp validators cho phoneNumber
  phoneNumber: string()
    .required()
    .numeric()
    .length(10)
    .custom(
      (value) => value.startsWith('0'),
      'Số điện thoại phải bắt đầu bằng số 0'
    ),

  // Optional với validators - optional() phải ở cuối
  bio: string()
    .minLength(10)
    .maxLength(500)
    .notEmpty()
    .optional(),

  // Kết hợp validators cho number
  score: number()
    .required()
    .integer()
    .min(0)
    .max(100)
    .multipleOf(5),
});

const fullName = useFieldValidation(adapter, 'fullName');
const phoneNumber = useFieldValidation(adapter, 'phoneNumber');
const bio = useFieldValidation(adapter, 'bio');
const score = useFieldValidation(adapter, 'score');

const handleSubmit = () => {
  const result = validateAll();
  if (result.success) {
    alert('✓ Tất cả combined validators đã pass!');
  }
};
</script>
