"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
}

export default function RevealStaggerGroup({ children, className, staggerMs = 80 }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const items = React.Children.toArray(children);
  const staggerSec = staggerMs / 1000;

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.65,
            delay: i * staggerSec,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
