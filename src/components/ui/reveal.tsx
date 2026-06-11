"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/ui";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

export function Reveal({ children, className }: RevealProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(className)}
      initial={{ opacity: 0, y: 10 }}
      transition={{
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
}
