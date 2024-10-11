"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { HeartIcon, ShoppingCart } from "lucide-react";
import { Product } from "@/types";

// Mock product data
const products: Product[] = [
  {
    id: 1,
    name: "Classic Burger",
    price: 9.99,
    category: "Burgers",
    image: "/images/menu/classic-burger.png",
    description:
      "Juicy beef patty with fresh lettuce, tomato, and our special sauce",
    rating: 4.5,
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
  },
  {
    id: 3,
    name: "Chicken Salad",
    price: 8.99,
    category: "Salads",
    image: "/images/menu/chicken-salad.png",
    description:
      "Grilled chicken breast on a bed of mixed greens with house dressing",
    rating: 4.2,
  },
  {
    id: 4,
    name: "Chocolate Milkshake",
    price: 4.99,
    category: "Drinks",
    image: "/images/menu/chocolate-milkshake.png",
    description: "Rich and creamy chocolate shake topped with whipped cream",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Margherita Pizza",
    price: 11.99,
    category: "Pizza",
    image: "/images/menu/margherita-pizza.png",
    description: "Classic pizza with tomato sauce, fresh mozzarella, and basil",
    rating: 4.6,
  },
  {
    id: 6,
    name: "Caesar Salad",
    price: 7.99,
    category: "Salads",
    image: "/images/menu/caesar-salad.png",
    description:
      "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan",
    rating: 4.4,
  },
  {
    id: 7,
    name: "Cheeseburger",
    price: 10.99,
    category: "Burgers",
    image: "/images/menu/cheeseburger.png",
    description: "Our classic burger topped with melted cheddar cheese",
    rating: 4.3,
  },
  {
    id: 8,
    name: "Iced Tea",
    price: 2.99,
    category: "Drinks",
    image: "/images/menu/iced-tea.png",
    description:
      "Refreshing iced tea brewed daily, served with or without lemon",
    rating: 4.1,
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [sortBy, setSortBy] = useState("name");

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory === "All" ? true : product.category === selectedCategory
    )
    .filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return a.price - b.price;
      return b.rating - a.rating;
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Our <span className="text-[#FF9F29]">Delicious Menu</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Burgers">Burgers</SelectItem>
                <SelectItem value="Pizza">Pizza</SelectItem>
                <SelectItem value="Salads">Salads</SelectItem>
                <SelectItem value="Drinks">Drinks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Price Range</Label>
            <Slider
              min={0}
              max={20}
              step={0.5}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mt-2"
            />
            <div className="flex justify-between mt-2">
              <span>${priceRange[0].toFixed(2)}</span>
              <span>${priceRange[1].toFixed(2)}</span>
            </div>
          </div>
          <div>
            <Label htmlFor="sort">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <motion.div
          className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-center">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-white p-4">
                  <p className="text-[#FF9F29] font-bold text-xl">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <ShoppingCart className="w-5 h-5 text-gray-400 hover:text-[#FF9F29] transition-colors" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
