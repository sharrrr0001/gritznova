"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PlaceholderTag } from "@/components/ui/badge";
import { stats } from "@/content/home";
import type { Stat } from "@/content/types";

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || stat.value === null) return;
    if (reduce) return;
    const controls = animate(0, stat.value, {
      duration: 1.6,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, stat.value]);

  if (stat.value === null) {
    return (
      <span ref={ref} className="placeholder-chip inline-block rounded-lg px-3 text-[0.6em]">
        [NN]{stat.suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className="tabular-nums">
      {stat.prefix}
      {reduce ? stat.value : display}
      {stat.suffix}
    </span>
  );
}

export function Stats() {
  const anyPlaceholder = stats.some((s) => s.placeholder || s.value === null);

  return (
    <section aria-label="GRITZNOVA in numbers" className="border-border bg-surface border-y">
      <div className="container-page">
        <dl className="divide-border grid grid-cols-2 lg:grid-cols-4 lg:divide-x">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2 px-4 py-10 text-center sm:py-12">
              <dt className="text-fg-muted order-2 text-sm">{stat.label}</dt>
              <dd className="text-fg order-1 text-4xl font-semibold tracking-tight sm:text-5xl">
                <Counter stat={stat} />
              </dd>
            </div>
          ))}
        </dl>
        {anyPlaceholder ? (
          <div className="flex justify-center pb-6">
            <PlaceholderTag />
          </div>
        ) : null}
      </div>
    </section>
  );
}
