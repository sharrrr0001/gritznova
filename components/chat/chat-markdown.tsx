"use client";

import Link from "next/link";
import Markdown, { type Components } from "react-markdown";

/**
 * Renders assistant messages as safe markdown. Raw HTML is never rendered (react-markdown default),
 * and only http(s), mailto, tel and relative links are kept.
 */
function safeHref(href?: string) {
  if (!href) return undefined;
  if (href.startsWith("/") || href.startsWith("#")) return href;
  try {
    const url = new URL(href);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? href : undefined;
  } catch {
    return undefined;
  }
}

export function ChatMarkdown({
  text,
  onInternalLink,
}: {
  text: string;
  onInternalLink?: () => void;
}) {
  const components: Components = {
    a: ({ href, children }) => {
      const safe = safeHref(href);
      if (!safe) return <span>{children}</span>;
      if (safe.startsWith("/") || safe.startsWith("#")) {
        return (
          <Link
            href={safe}
            onClick={onInternalLink}
            className="text-accent-text font-medium underline underline-offset-2"
          >
            {children}
          </Link>
        );
      }
      return (
        <a
          href={safe}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-text font-medium underline underline-offset-2"
        >
          {children}
        </a>
      );
    },
    p: ({ children }) => <p className="[&:not(:first-child)]:mt-2.5">{children}</p>,
    ul: ({ children }) => (
      <ul className="marker:text-fg-subtle mt-2 list-disc space-y-1 pl-5">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="marker:text-fg-subtle mt-2 list-decimal space-y-1 pl-5">{children}</ol>
    ),
    strong: ({ children }) => <strong className="text-fg font-semibold">{children}</strong>,
    code: ({ children }) => (
      <code className="bg-surface-3 rounded px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
    ),
    h1: ({ children }) => <p className="mt-2 font-semibold">{children}</p>,
    h2: ({ children }) => <p className="mt-2 font-semibold">{children}</p>,
    h3: ({ children }) => <p className="mt-2 font-semibold">{children}</p>,
    img: () => null,
  };

  return <Markdown components={components}>{text}</Markdown>;
}
