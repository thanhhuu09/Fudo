"use client";

import { useState } from "react";
import { OrderForm } from "@/components/Order/OrderForm";
import { ProductList } from "@/components/Order/ProductList";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import useAuthStore from "@/store/authStore";

export default function OrderPage() {
  const [isLoading, setIsLoading] = useState(false); // Giữ lại để dùng trong UI
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { items } = useCartStore();
  const { accessToken } = useAuthStore((state) => state);

  const handleSubmit = async (orderData: {
    name: string;
    selectedAddressId: string;
    phone: string;
    paymentMethod: "credit_card" | "cod";
  }) => {
    const order = {
      ...orderData,
      address: orderData.selectedAddressId, // Map selectedAddressId to address
      items: items.map((item) => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
      })),
    };
    try {
      setIsLoading(true);
      console.log("Order created:", order);
      // Giả lập gửi request, nếu thành công thì setOrderPlaced(true)
      setOrderPlaced(true); // Uncomment hoặc thay bằng logic thực tế (API call)
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = items.reduce(
    (sum, product) => sum + product.menuItem.price * product.quantity,
    0
  );

  if (orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="mb-4">
          Thank you for your order. We&apos;ll process it shortly.
        </p>
        <Button onClick={() => setOrderPlaced(false)} disabled={isLoading}>
          {isLoading ? "Processing..." : "Place Another Order"}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Complete Your Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          {accessToken ? (
            <OrderForm onSubmit={handleSubmit} />
          ) : (
            <p className="text-lg">Please log in to complete your order.</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Products</h2>
          <ProductList products={items} />
          <div className="mt-4 text-right">
            <p className="text-lg font-semibold">
              Total: ${totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      {isLoading && (
        <p className="text-center mt-4">Processing your order...</p>
      )}
    </div>
  );
}
