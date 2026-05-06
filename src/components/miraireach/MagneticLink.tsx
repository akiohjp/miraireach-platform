"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticLink({ href, children, className, strength = 0.3 }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * strength,
      y: (e.clientY - rect.top - rect.height / 2) * strength,
    });
  };

  const onMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 350, damping: 22, mass: 0.5 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Link ref={ref} href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}
