"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// Mocks cart items
const initialCartItems = [
  {
    id: 1,
    name: "Classic Burger",
    price: 9.99,
    category: "Burgers",
    image: "/images/menu/classic-burger.png",
    description:
      "Juicy beef patty with fresh lettuce, tomato, and our special sauce",
    rating: 4.5,
    quantity: 1,
  },
  {
    id: 2,
    name: "Veggie Pizza",
    price: 12.99,
    category: "Pizza",
    image: "/images/menu/veggie-pizza.png",
    description:
      "Loaded with fresh vegetables and our signature blend of cheeses",
    rating: 4.8,
    quantity: 2,
  },
];
const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuality = (id: number, change: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full bg-[#FFCB45] hover:bg-[#FFB800] text-black"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>Your Cart</SheetHeader>
        <SheetDescription>
          Review your items and checkout when you&apos;re ready.
        </SheetDescription>
        <div className="mt-8 space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  className="rounded"
                  width={80}
                  height={80}
                  objectFit="cover"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuality(item.id, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuality(item.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <SheetFooter className="mt-8">
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <Button className="w-full bg-[#FFCB45] hover:bg-[#FFB800] text-black">
              Proceed to Checkout
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
