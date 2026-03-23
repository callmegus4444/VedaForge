"use client";

import { motion } from "framer-motion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
