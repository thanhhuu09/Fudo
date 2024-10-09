"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const items = [
  {
    image: "/images/order.svg",
    title: "Easy to order",
    description: "You only order through the app",
  },
  {
    image: "/images/delivery.svg",
    title: "Fastest Delivery",
    description: "Delivery will be on time",
  },
  {
    image: "/images/courier.svg",
    title: "Best Quality",
    description: "The best quality of food for you",
  },
];

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
    <section className="w-full py-12 px-4 bg-[#fff9ef]" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-xl font-medium text-[#FF9F29]"
            variants={itemVariants}
          >
            How It Works
          </motion.h2>
          <motion.h3
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            variants={itemVariants}
          >
            What We Serve
          </motion.h3>
          <motion.p
            className="text-center text-gray-600 font-medium text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Product Quality Is Our Priority, And Always Guarantees Halal And
            Safety Until It Is In Your Hands.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item, index) => (
            <motion.article
              key={index}
              className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="mb-6">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={120}
                  height={120}
                />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 font-medium">{item.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
