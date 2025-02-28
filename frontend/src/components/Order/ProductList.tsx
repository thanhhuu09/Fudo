import { Product } from "@/types";
import Image from "next/image";

export function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="flex items-center space-x-4 border-b pb-4"
        >
          <Image
            src={product.menuItem.imageURL || "/placeholder.svg"}
            alt={product.menuItem.name}
            width={80}
            height={80}
            className="rounded-md"
          />
          <div className="flex-grow">
            <h3 className="font-semibold">{product.menuItem.name}</h3>
            <p className="text-sm text-gray-500">
              Quantity: {product.quantity}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">
              ${product.menuItem.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Total: ${(product.menuItem.price * product.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
