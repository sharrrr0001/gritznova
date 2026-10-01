"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-border border-b", className)} {...props} />;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group text-fg hover:text-accent-text flex flex-1 items-center justify-between gap-6 py-5 text-left text-[1.0625rem] font-medium transition-colors",
          className,
        )}
        {...props}
      >
        {children}
        <span className="border-border text-fg-subtle group-data-[state=open]:border-accent group-data-[state=open]:text-accent-text grid size-7 shrink-0 place-items-center rounded-full border transition-transform duration-300 group-data-[state=open]:rotate-45">
          <Plus className="size-4" aria-hidden />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-[accordion-up_200ms_ease-out] data-[state=open]:animate-[accordion-down_250ms_ease-out]"
      {...props}
    >
      <div className={cn("text-fg-muted max-w-prose pr-12 pb-6", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
