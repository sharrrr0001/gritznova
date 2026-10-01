"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { LogoMark } from "@/components/layout/logo";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** The panel (markdown renderer, lead form, etc.) is only downloaded the first time the launcher is opened. */
const ChatPanel = dynamic(() => import("./chat-panel").then((m) => m.ChatPanel), {
  ssr: false,
  loading: () => (
    <div className="bg-accent text-accent-fg fixed right-6 bottom-6 z-[70] grid size-14 place-items-center rounded-full shadow-lg">
      <Loader2 className="size-5 animate-spin" aria-label="Loading chat" />
    </div>
  ),
});

const SEEN_KEY = "gz-chat-seen";
export const OPEN_CHAT_EVENT = "gz:open-chat";

/** Open the assistant from anywhere: `window.dispatchEvent(new Event("gz:open-chat"))`. */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);

  useEffect(() => {
    try {
      // Reading localStorage must happen after mount; this is a one-time sync from browser storage.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!localStorage.getItem(SEEN_KEY)) setFirstVisit(true);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const openChat = useCallback(() => {
    setLoaded(true);
    setOpen(true);
    setFirstVisit(false);
    track("chat_open");
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    window.addEventListener(OPEN_CHAT_EVENT, openChat);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, openChat);
  }, [openChat]);

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={openChat}
          aria-label="Open chat with Nova, the GRITZNOVA assistant"
          aria-haspopup="dialog"
          className="group fixed right-5 bottom-5 z-[70] flex items-center gap-3 rounded-full sm:right-6 sm:bottom-6"
        >
          <span className="glass border-border text-fg hidden h-10 items-center rounded-full border px-4 text-sm font-medium shadow-md transition-transform duration-200 group-hover:-translate-x-0.5 sm:flex">
            Ask Nova
          </span>
          {/* The G› mark doubles as the launcher. */}
          <span
            className={cn(
              "relative grid size-14 place-items-center rounded-full shadow-lg transition-transform duration-200 group-hover:-translate-y-0.5",
              firstVisit && "animate-pulse-once",
            )}
          >
            <LogoMark className="size-14 drop-shadow-sm" />
            <span
              className="border-bg bg-success absolute top-0.5 right-0.5 size-3 rounded-full border-2"
              aria-hidden
            />
          </span>
        </button>
      ) : null}
      {loaded ? <ChatPanel open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
