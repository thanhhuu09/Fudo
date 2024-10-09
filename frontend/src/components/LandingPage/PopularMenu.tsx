"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { HeartIcon, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MenuItem {
  name: string;
  description: string;
  price: number;
  image: string;
}

const menuItems: MenuItem[] = [
  {
    name: "Mie Ramen",
    description:
      "Savory noodles in a rich broth with tender pork and fresh vegetables",
    price: 20.2,
    image: "/images/menu/mie-ramen.png",
  },
  {
    name: "Salad Tahu",
    description: "Fresh tofu salad with crisp vegetables and tangy dressing",
    price: 15.5,
    image: "/images/menu/salad-tahu.png",
  },
  {
    name: "Roti Bakar",
    description: "Grilled bread with sweet and savory toppings of your choice",
    price: 12.8,
    image: "/images/menu/roti-bakar.png",
  },
  {
    name: "Spaghetti",
    description: "Al dente pasta with rich tomato sauce and Parmesan cheese",
    price: 18.9,
    image: "/images/menu/spaghetti.png",
  },
];

export default function PopularMenu() {
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
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="w-full py-12 px-4 bg-[#fff9ef]" id="popular-menu">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center space-y-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-xl font-medium text-[#FF9F29]"
            variants={itemVariants}
          >
            Our menu
          </motion.h2>
          <motion.h3
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            variants={itemVariants}
          >
            Our Popular Menu
          </motion.h3>
          <motion.p
            className="text-center text-gray-600 font-medium text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            variants={itemVariants}
          >
            We have a wide range of delicious food. Choose your favorite food
            and have a good meal
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-center">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center line-clamp-2">
                    {item.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-white p-4">
                  <p className="text-[#FF9F29] font-bold text-xl">
                    ${item.price.toFixed(2)}
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

        <motion.div
          className="text-center mt-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Button
              className="font-bold text-lg rounded-full bg-[#FFCB45] hover:bg-[#FFAC4B] text-black px-8 py-6 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              size="lg"
            >
              More Menu
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
