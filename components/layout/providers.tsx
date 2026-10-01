"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
      <Toaster
        position="bottom-left"
        toastOptions={{
          classNames: {
            toast: "!bg-surface !text-fg !border-border !shadow-lg !rounded-xl",
            description: "!text-fg-muted",
          },
        }}
      />
    </ThemeProvider>
  );
}
