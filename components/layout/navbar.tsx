"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { bookingHref, nav, site } from "@/content/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Chevron, Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

/** Tracks which home-page section is in view, so its nav link can be marked active. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const ids = nav.filter((n) => n.href.startsWith("/#")).map((n) => n.href.slice(2));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);
  return enabled ? active : null;
}

export function Navbar() {
  const pathname = usePathname();
  const activeSection = useActiveSection(pathname === "/");
  const isActive = (href: string) =>
    href.startsWith("/#")
      ? pathname === "/" && activeSection === href.slice(2)
      : pathname.startsWith(href);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main"
        className="bg-accent text-accent-fg sr-only rounded-md px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <div
        className={cn(
          "border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled ? "glass border-border" : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Main"
          className={cn(
            "container-page flex items-center justify-between gap-6 transition-[height] duration-300",
            scrolled ? "h-14" : "h-[72px]",
          )}
        >
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm transition-colors",
                    isActive(item.href)
                      ? "text-accent-text font-medium"
                      : "text-fg-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href={bookingHref} onClick={() => track("cta_click", { cta: "nav_book" })}>
                Book a Consultation
              </Link>
            </Button>

            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu aria-hidden />
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Content
                  className="bg-bg fixed inset-0 z-[60] flex flex-col"
                  aria-describedby={undefined}
                >
                  <Dialog.Title className="sr-only">Menu</Dialog.Title>
                  <div className="container-page flex h-[72px] items-center justify-between">
                    <Logo />
                    <Dialog.Close asChild>
                      <Button variant="ghost" size="icon" aria-label="Close menu">
                        <X aria-hidden />
                      </Button>
                    </Dialog.Close>
                  </div>
                  <ul className="container-page flex flex-1 flex-col gap-1 pt-6">
                    {nav.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="border-border text-fg flex items-center justify-between border-b py-4 text-2xl font-medium tracking-tight"
                        >
                          {item.label}
                          <Chevron className="text-fg-subtle h-4" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="container-page flex flex-col gap-3 pb-8">
                    <Button asChild size="lg">
                      <Link
                        href={bookingHref}
                        onClick={() => {
                          setOpen(false);
                          track("cta_click", { cta: "mobile_menu_book" });
                        }}
                      >
                        {site.booking.label}
                      </Link>
                    </Button>
                    <p className="text-fg-subtle text-center text-sm">
                      {site.contact.responseTime}
                    </p>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </nav>
      </div>
    </header>
  );
}
