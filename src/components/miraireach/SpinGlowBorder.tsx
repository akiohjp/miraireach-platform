"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function SpinGlowBorder({ children, className }: Props) {
  return (
    <div className={`relative rounded-[1.25rem] ${className ?? ""}`}>
      <motion.div
        className="absolute -inset-[1px] rounded-[1.25rem]"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(201,162,39,0.6), rgba(238,220,154,0.4), rgba(255,255,255,0.1), rgba(201,162,39,0.6))",
          opacity: 0.7,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
