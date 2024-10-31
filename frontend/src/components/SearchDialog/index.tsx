"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface SearchDialogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function SearchDialog({
  products,
  onSelectProduct,
}: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filteredProducts = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredProducts);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-[#FFCB45] hover:bg-[#FFB800] text-black"
        >
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
          <DialogDescription>
            Find the perfect product for you
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pr-10"
              autoFocus
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 max-h-[300px] overflow-auto"
              >
                <ul className="divide-y divide-gray-200">
                  {searchResults.map((product) => (
                    <motion.li
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                      onClick={() => handleSelectProduct(product)}
                    >
                      <div className="flex items-center space-x-4">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={40}
                          height={40}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {product.category}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-[#FF9F29]">
                          ${product.price.toFixed(2)}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
