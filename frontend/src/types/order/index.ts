export interface OrderItem {
  menuItem: string; // ID của món ăn
  quantity: number;
}

export interface Order {
  name: string;
  address: string;
  phone: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: "credit_card" | "cod"; // Chỉ chấp nhận 2 phương thức thanh toán
  status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"; // Trạng thái đơn hàng (có thể không bắt buộc)
  createdAt?: string; // Ngày tạo đơn hàng (tùy chọn)
}

// {
//     "name": "Thạch Thanh Hữu",
//     "address": "19, đường Nguyễn Hữu Thọ",
//     "phone": "0976297749",
//     "paymentMethod": "cod",
//     "products": [
//         {
//             "menuItem": "67ba86994650e7bea65dceb2",
//             "quantity": 1
//         }
//     ]
// }
