"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section className="bg-[#fff9ef] px-4 py-8 md:py-16 lg:py-20" id="home">
      <div className="container mx-auto">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="space-y-6 text-center md:text-left md:w-1/2"
            variants={itemVariants}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
              variants={itemVariants}
            >
              Be The Fastest
              <br />
              In Delivery Your{" "}
              <motion.span
                className="text-[#FF9F29] inline-block"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Food
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-gray-600 text-lg sm:text-xl max-w-md mx-auto md:mx-0"
              variants={itemVariants}
            >
              Get your food delivered at your doorstep in less than 30 minutes
              or get your money back
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button
                className="font-bold text-lg rounded-full bg-[#FFCB45] hover:bg-[#FFAC4B] text-black px-8 py-6 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                size="lg"
              >
                Order Now
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="w-full md:w-1/2 mt-8 md:mt-0"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <Image
                src="/images/hero-image.svg"
                alt="Delicious food delivery"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
