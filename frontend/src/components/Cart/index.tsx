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
import { formatNumber } from "@/lib/formatNumber";
import { useCartStore } from "@/store/cartStore";

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const items = useCartStore((state) => state.items);

  const updateQuality = useCartStore((state) => state.updateItems);

  if (isLoading) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full bg-[#FFCB45] hover:bg-[#FFB800] text-black"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>Your Cart</SheetHeader>
          <SheetDescription className="flex items-center justify-center h-full text-gray-500">
            Loading...
          </SheetDescription>
        </SheetContent>
      </Sheet>
    );
  }
  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full bg-[#FFCB45] hover:bg-[#FFB800] text-black"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>Your Cart</SheetHeader>
          <SheetDescription className="flex items-center justify-center h-full text-gray-500">
            Your cart is empty
          </SheetDescription>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full bg-[#FFCB45] hover:bg-[#FFB800] text-black"
        >
          <ShoppingCart className="w-5 h-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
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
            {items.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
              >
                <Image
                  src={item.menuItem.imageURL}
                  alt={item.menuItem.name}
                  className="rounded"
                  width={80}
                  height={80}
                  objectFit="cover"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.menuItem.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${formatNumber(item.menuItem.price)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuality(item._id, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuality(item._id, 1)}
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
                $
                {formatNumber(
                  items.reduce(
                    (sum, item) => sum + item.menuItem.price * item.quantity,
                    0
                  )
                )}
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
