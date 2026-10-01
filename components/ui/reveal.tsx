"use client";

import { m, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  y?: number;
}

/** Fades and slides content in once when it scrolls into view. Honors prefers-reduced-motion via MotionConfig. */
export function Reveal({ children, delay = 0, y = 16, ...props }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] }}
      {...props}
    >
      {children}
    </m.div>
  );
}

/** Container that staggers its <RevealItem> children. */
export function RevealGroup({
  children,
  stagger = 0.08,
  ...props
}: RevealProps & { stagger?: number }) {
  return (
    <m.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({ children, y = 16, ...props }: RevealProps) {
  return (
    <m.div
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] } },
      }}
      {...props}
    >
      {children}
    </m.div>
  );
}
