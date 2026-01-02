/**
 * Vietnamese locale messages
 * @module plugins/i18n/locales/vi
 */

import type { LocaleMessages } from '#types/index';

export const viMessages: LocaleMessages = {
  // String validators
  string: {
    type: 'Phải là chuỗi ký tự',
    required: 'Trường này là bắt buộc',
    empty: 'Trường này không được để trống',
    email: 'Phải là địa chỉ email hợp lệ',
    url: 'Phải là URL hợp lệ',
    uuid: 'Phải là UUID hợp lệ',
    minLength: 'Phải có ít nhất {min} ký tự',
    maxLength: 'Phải có nhiều nhất {max} ký tự',
    length: 'Phải có chính xác {length} ký tự',
    pattern: 'Định dạng không hợp lệ',
    matches: 'Không khớp với mẫu yêu cầu',
    startsWith: 'Phải bắt đầu bằng "{prefix}"',
    endsWith: 'Phải kết thúc bằng "{suffix}"',
    contains: 'Phải chứa "{substring}"',
    alpha: 'Chỉ được chứa chữ cái',
    alphanumeric: 'Chỉ được chứa chữ cái và số',
    numeric: 'Chỉ được chứa số',
    lowercase: 'Phải là chữ thường',
    uppercase: 'Phải là chữ hoa',
    trim: 'Không được có khoảng trắng ở đầu hoặc cuối',
    notEmpty: 'Không được để trống hoặc chỉ chứa khoảng trắng',
  },

  // Number validators
  number: {
    type: 'Phải là số',
    required: 'Trường này là bắt buộc',
    min: 'Phải lớn hơn hoặc bằng {min}',
    max: 'Phải nhỏ hơn hoặc bằng {max}',
    range: 'Phải nằm trong khoảng từ {min} đến {max}',
    integer: 'Phải là số nguyên',
    positive: 'Phải là số dương',
    negative: 'Phải là số âm',
    nonPositive: 'Phải là số không hoặc số âm',
    nonNegative: 'Phải là số không hoặc số dương',
    multipleOf: 'Phải là bội số của {factor}',
    finite: 'Phải là số hữu hạn',
    safe: 'Phải là số nguyên an toàn',
  },

  // Boolean validators
  boolean: {
    type: 'Phải là giá trị boolean',
    required: 'Trường này là bắt buộc',
    isTrue: 'Phải là đúng',
    isFalse: 'Phải là sai',
  },

  // Date validators
  date: {
    type: 'Phải là ngày hợp lệ',
    required: 'Trường này là bắt buộc',
    invalid: 'Ngày không hợp lệ',
    min: 'Phải sau ngày {date}',
    max: 'Phải trước ngày {date}',
    minDate: 'Phải vào hoặc sau ngày {date}',
    maxDate: 'Phải vào hoặc trước ngày {date}',
    isBefore: 'Phải trước ngày {date}',
    isAfter: 'Phải sau ngày {date}',
    past: 'Phải là ngày trong quá khứ',
    future: 'Phải là ngày trong tương lai',
  },

  // Array validators
  array: {
    type: 'Phải là mảng',
    required: 'Trường này là bắt buộc',
    minItems: 'Phải có ít nhất {min} phần tử',
    maxItems: 'Phải có nhiều nhất {max} phần tử',
    length: 'Phải có chính xác {length} phần tử',
    unique: 'Tất cả phần tử phải là duy nhất',
    includes: 'Phải bao gồm {value}',
    notEmpty: 'Không được là mảng trống',
    item: 'Phần tử tại vị trí {index} không hợp lệ',
  },

  // Object validators
  object: {
    type: 'Phải là đối tượng',
    required: 'Trường này là bắt buộc',
    unknown: 'Trường không xác định: {field}',
    missing: 'Thiếu trường bắt buộc: {field}',
    shape: 'Đối tượng không khớp với cấu trúc mong đợi',
    notEmpty: 'Không được là đối tượng trống',
  },

  // Logic validators
  logic: {
    and: 'Tất cả điều kiện phải được đáp ứng',
    or: 'Ít nhất một điều kiện phải được đáp ứng',
    not: 'Điều kiện không được đáp ứng',
    xor: 'Chính xác một điều kiện phải được đáp ứng',
    if: 'Xác thực có điều kiện thất bại',
  },

  // Comparison validators
  comparison: {
    equals: 'Phải bằng {expected}',
    notEquals: 'Không được bằng {expected}',
    oneOf: 'Phải là một trong các giá trị: {values}',
    notOneOf: 'Không được là một trong các giá trị: {values}',
    sameAs: 'Phải giống với {field}',
    differentFrom: 'Phải khác với {field}',
  },

  // Common/Generic
  common: {
    required: 'Trường này là bắt buộc',
    optional: 'Trường này là tùy chọn',
    invalid: 'Giá trị không hợp lệ',
    unknown: 'Lỗi xác thực không xác định',
    custom: 'Xác thực thất bại',
    transform: 'Chuyển đổi thất bại',
  },

  // File validators
  file: {
    type: 'Phải là tệp tin',
    required: 'Tệp tin là bắt buộc',
    size: 'Kích thước tệp tin phải nhỏ hơn {max}',
    minSize: 'Kích thước tệp tin phải lớn hơn {min}',
    mimeType: 'Loại tệp tin phải là một trong: {types}',
    extension: 'Phần mở rộng tệp tin phải là một trong: {extensions}',
  },

  // Business validators
  business: {
    creditCard: 'Phải là số thẻ tín dụng hợp lệ',
    phone: 'Phải là số điện thoại hợp lệ',
    postalCode: 'Phải là mã bưu chính hợp lệ',
    ssn: 'Phải là SSN hợp lệ',
    ein: 'Phải là EIN hợp lệ',
    iban: 'Phải là IBAN hợp lệ',
    swift: 'Phải là mã SWIFT hợp lệ',
    vatId: 'Phải là VAT ID hợp lệ',
  },
};
