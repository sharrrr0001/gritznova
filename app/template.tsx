import type { ReactNode } from "react";

/**
 * Subtle fade between routes. Templates re-mount on every navigation.
 * Pure CSS (not JS) so first paint never waits for hydration; reduced motion is honored in globals.css.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="animate-[page-in_0.4s_var(--ease-out-quart)_both]">{children}</div>;
}
