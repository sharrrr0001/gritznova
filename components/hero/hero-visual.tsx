"use client";

import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { HeroFallback } from "./hero-fallback";
import type { SceneInput } from "./scene/config";

/** three.js + R3F are only downloaded once the page is idle, so they never block first paint. */
const HeroScene = dynamic(() => import("./scene/hero-scene"), { ssr: false });

class SceneErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function subscribeMobile(cb: () => void) {
  const mq = window.matchMedia("(max-width: 1023px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getMobile = () => window.matchMedia("(max-width: 1023px)").matches;

type Mode = "pending" | "3d" | "fallback";

/** How long the canvas may go without drawing (while visible) before it is considered broken. */
const STALL_MS = 2500;
/** Remount attempts before giving up and keeping the static version. */
const MAX_RECOVERIES = 2;

/**
 * Hero visual: the interactive 3D "Digital Engineering Core", layered over a static SVG version.
 *
 * The static version is always underneath and is only hidden once the canvas has *actually drawn
 * frames*. A watchdog remounts the canvas if it stops drawing (lost GPU context, hot reload, driver
 * hiccup) and falls back to the static version for good after repeated failures, so the hero can
 * never be left empty.
 */
export function HeroVisual({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [sceneKey, setSceneKey] = useState(0);
  const reduced = useReducedMotion() ?? false;
  const mobile = useSyncExternalStore(subscribeMobile, getMobile, () => false);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

  const container = useRef<HTMLDivElement>(null);
  const input = useRef<SceneInput>({ px: 0, py: 0, scroll: 0 });
  const heartbeat = useRef(0);
  const graceUntil = useRef(0);
  const recoveries = useRef(0);

  // Decide whether to load 3D, after the browser is idle.
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    const decide = () => setMode(supportsWebGL() && !connection?.saveData ? "3d" : "fallback");
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(decide, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(decide, 300);
    return () => clearTimeout(id);
  }, []);

  // Pointer + scroll input (written to a ref: no React re-renders per frame).
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      input.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      input.current.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      const s = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      input.current.scroll = s;
      if (container.current) container.current.style.opacity = String(1 - s * 0.55);
    };
    onScroll();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Pause rendering while the hero is off-screen. Resuming gets a grace period before the watchdog.
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        if (visible) graceUntil.current = performance.now() + STALL_MS;
        setActive(visible);
      },
      { rootMargin: "100px" },
    );
    observer.observe(el);
    const onVisibility = () => {
      if (document.visibilityState === "visible") graceUntil.current = performance.now() + STALL_MS;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const recover = () => {
    setReady(false);
    if (recoveries.current >= MAX_RECOVERIES) {
      setMode("fallback");
      return;
    }
    recoveries.current += 1;
    graceUntil.current = performance.now() + STALL_MS * 2;
    setSceneKey((k) => k + 1);
  };

  // Watchdog: if the canvas is shown (static version hidden) but has stopped drawing, remount it.
  // Before `ready` the static version is still visible, so there is nothing to guard.
  useEffect(() => {
    if (mode !== "3d" || !ready || !active || reduced) return;
    const id = window.setInterval(() => {
      const now = performance.now();
      if (document.visibilityState !== "visible" || now < graceUntil.current) return;
      if (now - heartbeat.current > STALL_MS) recover();
    }, 1000);
    return () => window.clearInterval(id);
  });

  return (
    <div ref={container} className={cn("relative", className)} aria-hidden>
      <HeroFallback
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          ready && mode === "3d" ? "opacity-0" : "opacity-100",
        )}
      />
      {mode === "3d" ? (
        <SceneErrorBoundary key={sceneKey} onError={recover}>
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              ready ? "opacity-100" : "opacity-0",
            )}
          >
            <HeroScene
              theme={theme}
              reduced={reduced}
              mobile={mobile}
              active={active}
              input={input}
              heartbeat={heartbeat}
              onReady={() => setReady(true)}
              onContextLost={recover}
            />
          </div>
        </SceneErrorBoundary>
      ) : null}
    </div>
  );
}
