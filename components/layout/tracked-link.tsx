"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & { event?: string };

/** A Next.js Link that records a `cta_click` analytics event. */
export function TrackedLink({ event, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track("cta_click", { cta: event ?? String(props.href) });
        onClick?.(e);
      }}
    />
  );
}
