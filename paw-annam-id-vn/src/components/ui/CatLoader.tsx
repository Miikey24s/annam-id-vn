"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import PawPrint from "./PawPrint";

type CatLoaderProps = {
  text?: string;
};

export default function CatLoader({ text = "Loading..." }: CatLoaderProps) {
  const containerVariants: Variants = {
    start: { transition: { staggerChildren: 0.15 } },
    end: { transition: { staggerChildren: 0.15 } },
  };

  const pawVariants: Variants = {
    start: { opacity: 0, scale: 0.5, y: 10 },
    end: {
      opacity: [0, 1, 1, 0],
      scale: [0.8, 1.1, 1, 0.8],
      y: [10, -5, 0, -10],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 py-20 min-h-[300px]">
      {/* Walking Paws Animation */}
      <motion.div
        variants={containerVariants}
        initial="start"
        animate="end"
        className="flex items-center gap-4 mb-6 relative h-16 w-48 justify-center"
      >
        <motion.div variants={pawVariants} className="absolute left-0 top-6 w-8 h-8 text-primary/80 rotate-12">
          <PawPrint />
        </motion.div>
        <motion.div variants={pawVariants} className="absolute left-12 top-0 w-8 h-8 text-secondary/80 -rotate-12 [animation-delay:0.3s]">
          <PawPrint />
        </motion.div>
        <motion.div variants={pawVariants} className="absolute left-24 top-6 w-8 h-8 text-primary/80 rotate-45 [animation-delay:0.6s]">
          <PawPrint />
        </motion.div>
        <motion.div variants={pawVariants} className="absolute left-36 top-0 w-8 h-8 text-secondary/80 -rotate-45 [animation-delay:0.9s]">
          <PawPrint />
        </motion.div>
      </motion.div>

      {/* Cat Meow SVG */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-12 h-12 text-primary animate-purr"
        >
          {/* Cute Cat Face Silhouette */}
          <path d="M12 3c-1.2 0-2.4.3-3.5.8L5 2 6.5 6.2C4.3 7.8 3 10.3 3 13c0 4.4 4 8 9 8s9-3.6 9-8c0-2.7-1.3-5.2-3.5-6.8L19 2l-3.5 1.8c-1.1-.5-2.3-.8-3.5-.8zm-3 8c.8 0 1.5.7 1.5 1.5S9.8 14 9 14s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm6 0c.8 0 1.5.7 1.5 1.5S15.8 14 15 14s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm-3 4.5c1.2 0 2.2.6 2.5 1.5h-5c.3-.9 1.3-1.5 2.5-1.5z" />
        </svg>
      </div>

      <p className="mt-4 text-sm font-semibold tracking-wide text-text-secondary animate-pulse">
        {text}
      </p>
    </div>
  );
}
