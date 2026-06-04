"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/gam/gam-lp-tokens";

export default function GamRevealMaskLine({
  children,
  active,
  delay,
  className,
}: {
  children: React.ReactNode;
  active: boolean;
  delay: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "108%" }}
        animate={active ? { y: 0 } : {}}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        <div className={className}>{children}</div>
      </motion.div>
    </div>
  );
}
