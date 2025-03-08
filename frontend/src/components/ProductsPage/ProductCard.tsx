import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { MenuItem } from "@/types";
import { Button } from "../ui/button";
import { HeartIcon, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

const ProductCard = ({ product }: { product: MenuItem }) => {
  const user = useAuthStore((state) => state.user);
  console.log("user", user);

  const addToCart = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  const handleAddToCart = async (userId: string) => {
    console.log("userID", userId);

    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }
    const currentQuantity = items.find(
      (item) => item.menuItem._id === product._id
    )?.quantity;
    if (currentQuantity) {
      await addToCart(userId, product._id, currentQuantity + 1);
      toast.success("Added to cart");
      return;
    }
    addToCart(userId, product._id, 1);
    toast.success("Added to cart");
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={product.imageURL}
            alt={product.name}
            layout="fill"
            objectFit="contain"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2 text-center">{product.name}</h3>
        <p className="text-sm text-gray-600 text-center line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-white p-4">
        <p className="text-[#FF9F29] font-bold text-xl">
          ${product.price.toFixed(2)}
        </p>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => handleAddToCart(user?._id as string)}
          >
            <ShoppingCart className="w-5 h-5 text-gray-400 hover:text-[#FF9F29] transition-colors" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
