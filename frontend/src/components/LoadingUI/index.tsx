"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LoadingUI() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#FFF9EF] z-50">
      <div className="text-center">
        <motion.div
          className="w-24 h-24 mb-8 mx-auto border-8 border-[#FFCA45] border-t-[#FF9F29] rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.h2
          className="text-2xl font-bold text-[#FF9F29]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading...
        </motion.h2>
      </div>
    </div>
  );
}
