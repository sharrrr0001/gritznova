import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-5",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-2 text-fg-muted",
        accent: "border-transparent bg-accent-soft text-accent-text",
        outline: "border-border-strong text-fg-muted",
        placeholder: "placeholder-chip bg-transparent text-[0.6875rem] uppercase tracking-wider",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Visible marker for content that still needs to be replaced with real data. */
export function PlaceholderTag({ className }: { className?: string }) {
  return (
    <Badge
      variant="placeholder"
      className={className}
      title="Replace with real content before launch"
    >
      Placeholder
    </Badge>
  );
}
