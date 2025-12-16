/**
 * Vietnamese locale messages
 * @module plugins/i18n/locales/vi
 */

import type { LocaleMessages } from '#types/index';

export const viMessages: LocaleMessages = {
  // String validators
  string: {
    type: 'Phai la chuoi ky tu',
    required: 'Truong nay la bat buoc',
    empty: 'Truong nay khong duoc de trong',
    email: 'Phai la dia chi email hop le',
    url: 'Phai la URL hop le',
    uuid: 'Phai la UUID hop le',
    minLength: 'Phai co it nhat {min} ky tu',
    maxLength: 'Phai co nhieu nhat {max} ky tu',
    length: 'Phai co chinh xac {length} ky tu',
    pattern: 'Dinh dang khong hop le',
    matches: 'Khong khop voi mau yeu cau',
    startsWith: 'Phai bat dau bang "{prefix}"',
    endsWith: 'Phai ket thuc bang "{suffix}"',
    contains: 'Phai chua "{substring}"',
    alpha: 'Chi duoc chua chu cai',
    alphanumeric: 'Chi duoc chua chu cai va so',
    numeric: 'Chi duoc chua so',
    lowercase: 'Phai la chu thuong',
    uppercase: 'Phai la chu hoa',
    trim: 'Khong duoc co khoang trang o dau hoac cuoi',
    notEmpty: 'Khong duoc de trong hoac chi chua khoang trang',
  },

  // Number validators
  number: {
    type: 'Phai la so',
    required: 'Truong nay la bat buoc',
    min: 'Phai lon hon hoac bang {min}',
    max: 'Phai nho hon hoac bang {max}',
    range: 'Phai nam trong khoang tu {min} den {max}',
    integer: 'Phai la so nguyen',
    positive: 'Phai la so duong',
    negative: 'Phai la so am',
    nonPositive: 'Phai la so khong hoac so am',
    nonNegative: 'Phai la so khong hoac so duong',
    multipleOf: 'Phai la boi so cua {factor}',
    finite: 'Phai la so huu han',
    safe: 'Phai la so nguyen an toan',
  },

  // Boolean validators
  boolean: {
    type: 'Phai la gia tri boolean',
    required: 'Truong nay la bat buoc',
    isTrue: 'Phai la true',
    isFalse: 'Phai la false',
  },

  // Date validators
  date: {
    type: 'Phai la ngay hop le',
    required: 'Truong nay la bat buoc',
    invalid: 'Ngay khong hop le',
    min: 'Phai sau ngay {date}',
    max: 'Phai truoc ngay {date}',
    minDate: 'Phai vao hoac sau ngay {date}',
    maxDate: 'Phai vao hoac truoc ngay {date}',
    isBefore: 'Phai truoc ngay {date}',
    isAfter: 'Phai sau ngay {date}',
    past: 'Phai la ngay trong qua khu',
    future: 'Phai la ngay trong tuong lai',
  },

  // Array validators
  array: {
    type: 'Phai la mang',
    required: 'Truong nay la bat buoc',
    minItems: 'Phai co it nhat {min} phan tu',
    maxItems: 'Phai co nhieu nhat {max} phan tu',
    length: 'Phai co chinh xac {length} phan tu',
    unique: 'Tat ca phan tu phai la duy nhat',
    includes: 'Phai bao gom {value}',
    notEmpty: 'Khong duoc la mang trong',
    item: 'Phan tu tai vi tri {index} khong hop le',
  },

  // Object validators
  object: {
    type: 'Phai la doi tuong',
    required: 'Truong nay la bat buoc',
    unknown: 'Truong khong xac dinh: {field}',
    missing: 'Thieu truong bat buoc: {field}',
    shape: 'Doi tuong khong khop voi cau truc mong doi',
    notEmpty: 'Khong duoc la doi tuong trong',
  },

  // Logic validators
  logic: {
    and: 'Tat ca dieu kien phai duoc dap ung',
    or: 'It nhat mot dieu kien phai duoc dap ung',
    not: 'Dieu kien khong duoc dap ung',
    xor: 'Chinh xac mot dieu kien phai duoc dap ung',
    if: 'Xac thuc co dieu kien that bai',
  },

  // Comparison validators
  comparison: {
    equals: 'Phai bang {expected}',
    notEquals: 'Khong duoc bang {expected}',
    oneOf: 'Phai la mot trong cac gia tri: {values}',
    notOneOf: 'Khong duoc la mot trong cac gia tri: {values}',
    sameAs: 'Phai giong voi {field}',
    differentFrom: 'Phai khac voi {field}',
  },

  // Common/Generic
  common: {
    required: 'Truong nay la bat buoc',
    optional: 'Truong nay la tuy chon',
    invalid: 'Gia tri khong hop le',
    unknown: 'Loi xac thuc khong xac dinh',
    custom: 'Xac thuc that bai',
    transform: 'Chuyen doi that bai',
  },

  // File validators
  file: {
    type: 'Phai la tep tin',
    required: 'Tep tin la bat buoc',
    size: 'Kich thuoc tep tin phai nho hon {max}',
    minSize: 'Kich thuoc tep tin phai lon hon {min}',
    mimeType: 'Loai tep tin phai la mot trong: {types}',
    extension: 'Phan mo rong tep tin phai la mot trong: {extensions}',
  },

  // Business validators
  business: {
    creditCard: 'Phai la so the tin dung hop le',
    phone: 'Phai la so dien thoai hop le',
    postalCode: 'Phai la ma buu chinh hop le',
    ssn: 'Phai la SSN hop le',
    ein: 'Phai la EIN hop le',
    iban: 'Phai la IBAN hop le',
    swift: 'Phai la ma SWIFT hop le',
    vatId: 'Phai la VAT ID hop le',
  },
};
