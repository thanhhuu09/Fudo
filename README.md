# Fudo - Nền tảng đặt món ăn

## Giới thiệu
Fudo là một nền tảng đặt món ăn trực tuyến, giúp người dùng dễ dàng xem menu, thêm món vào giỏ hàng, đặt hàng và thanh toán online thông qua Stripe API. Người bán (Admin) có thể quản lý sản phẩm và theo dõi đơn hàng. Hệ thống có phân quyền RBAC để đảm bảo chỉ người có quyền mới được thực hiện các thao tác quản lý.

## Tính năng chính
- **Người dùng**: Xem menu, thêm món vào giỏ hàng, đặt hàng, thanh toán online.
- **Người bán (Admin)**: Thêm sản phẩm, kiểm tra đơn hàng.
- **RBAC (Role-Based Access Control)**: Phân quyền người dùng (User, Admin).
- **Xác thực & Bảo mật**: Google OAuth, JWT.
- **Thanh toán**: Tích hợp Stripe API.
- **Tài liệu API**: Sử dụng Swagger.

## Công nghệ sử dụng
- **Frontend**: Next.js, TailwindCSS, Zustand, ShadCN.
- **Backend**: NestJS, MongoDB, Stripe API, Google OAuth, JWT.

## Cài đặt và chạy project
### Yêu cầu
- Node.js >= 16
- MongoDB
- Stripe API key

### Cách chạy
```bash
# Clone repository
git clone <repo-url>
cd fudo

# Cài đặt dependencies
npm install

# Chạy frontend
cd frontend
npm run dev

# Chạy backend
cd backend
npm run start
```

## Đóng góp
Mọi đóng góp đều được hoan nghênh! Vui lòng tạo Pull Request nếu bạn có ý tưởng cải thiện.

## Giấy phép
Dự án này được phát hành theo giấy phép MIT.

---
Fudo - Đặt món ăn dễ dàng hơn bao giờ hết! 🚀
