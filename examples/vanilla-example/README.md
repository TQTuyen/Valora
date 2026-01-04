# Valora Vanilla Example

Ví dụ đơn giản sử dụng Valora Vanilla Adapter với form đăng ký.

## Chạy ví dụ

```bash
# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev

# Build production
npm run build
```

## Features

Form có 4 fields:
- **Username**: Tên đăng nhập (3-20 ký tự)
- **Email**: Email hợp lệ
- **Password**: Mật khẩu (6-50 ký tự)
- **Age**: Tuổi (18-100)

## Tính năng validation

- ✓ Validate realtime khi nhập liệu (onChange)
- ✓ Validate khi rời khỏi field (onBlur)
- ✓ Validate khi submit form
- ✓ Hiển thị lỗi trực quan với accessibility support
- ✓ Reset form sau khi submit thành công
