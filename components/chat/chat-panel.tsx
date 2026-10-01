"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUp, Minus, RotateCcw, Square, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { LogoMark } from "@/components/layout/logo";
import { track } from "@/lib/analytics";
import { CHAT_MAX_MESSAGE_CHARS } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { ChatLeadForm, type LeadValues } from "./chat-lead-form";
import { ChatMarkdown } from "./chat-markdown";
import { WhatsAppButton } from "./whatsapp-button";

type Role = "user" | "assistant";
interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  error?: boolean;
  /** Local-only messages (welcome, canned replies) are shown but never sent to the API. */
  local?: boolean;
}

interface StoredState {
  messages: ChatMessage[];
  leadSubmitted: boolean;
}

const STORAGE_KEY = "gz-chat-v1";
const LEAD_TOKEN = "[[LEAD_FORM]]";
const ERROR_RE = /\[\[ERROR:([\s\S]*?)\]\]/;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  local: true,
  content:
    "Hi, I'm **Nova**, GRITZNOVA's assistant.\n\nI can tell you about our services, how we work, and help you scope a project. What are you working on?",
};

const QUICK_REPLIES = [
  "What services do you offer?",
  "Get a project estimate",
  "See case studies",
  "Talk to a human",
] as const;

const uid = () => Math.random().toString(36).slice(2, 10);

function loadState(): StoredState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredState;
      if (Array.isArray(parsed.messages) && parsed.messages.length) return parsed;
    }
  } catch {
    /* ignore */
  }
  return { messages: [WELCOME], leadSubmitted: false };
}

interface ChatPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatPanel({ open, onOpenChange }: ChatPanelProps) {
  const [initialState] = useState(loadState);
  const [messages, setMessages] = useState<ChatMessage[]>(initialState.messages);
  const [leadSubmitted, setLeadSubmitted] = useState(initialState.leadSubmitted);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [leadPrefill, setLeadPrefill] = useState<Partial<LeadValues>>({});
  const [announcement, setAnnouncement] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stickToBottom = useRef(true);

  // Persist the conversation for this browser session.
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, leadSubmitted } satisfies StoredState),
      );
    } catch {
      /* ignore */
    }
  }, [messages, leadSubmitted]);

  // Auto-scroll when new content arrives, unless the visitor scrolled up to read.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTo({ top: el.scrollHeight });
  }, [messages, showLead, streaming]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  // Auto-grow the textarea up to ~6 lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const openLeadForm = useCallback(
    (prefill: Partial<LeadValues> = {}) => {
      if (leadSubmitted) return;
      setLeadPrefill((p) => ({ ...p, ...prefill }));
      setShowLead(true);
    },
    [leadSubmitted],
  );

  const transcript = messages
    .filter((m) => !m.local && !m.error)
    .map((m) => ({ role: m.role, content: m.content }));

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || streaming) return;
    if (text.length > CHAT_MAX_MESSAGE_CHARS) return;

    // "Talk to a human" is handled locally. No model call needed.
    if (/^talk to a human$/i.test(text)) {
      setMessages((m) => [
        ...m,
        { id: uid(), role: "user", content: text },
        {
          id: uid(),
          role: "assistant",
          local: true,
          content: leadSubmitted
            ? "You're all set. Our team already has your details and will be in touch within one business day."
            : "Of course. Leave your details below and a senior member of our team will get back to you within one business day.",
        },
      ]);
      setInput("");
      openLeadForm();
      return;
    }

    const emailMatch = text.match(EMAIL_RE);
    const userMsg: ChatMessage = { id: uid(), role: "user", content: text };
    const assistantId = uid();
    const history = [...messages, userMsg];

    setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);
    stickToBottom.current = true;
    track("chat_message");

    const controller = new AbortController();
    abortRef.current = controller;

    const apiMessages = history
      .filter((m) => !m.local && !m.error && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content }));

    let full = "";
    const setAssistant = (content: string, error = false) =>
      setMessages((m) =>
        m.map((msg) => (msg.id === assistantId ? { ...msg, content, error } : msg)),
      );

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Sorry, something went wrong. Please try again.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const errorMatch = full.match(ERROR_RE);
        if (errorMatch) {
          const before = full.replace(ERROR_RE, "").replace(LEAD_TOKEN, "").trim();
          throw new Error(before ? `${before}\n\n${errorMatch[1]}` : errorMatch[1]);
        }
        setAssistant(full.replace(LEAD_TOKEN, "").replace(/\[\[[A-Z_]*$/, ""));
      }

      const clean = full.replace(LEAD_TOKEN, "").trim();
      setAssistant(clean || "Sorry, I didn't catch that. Could you rephrase?");
      setAnnouncement(`Nova says: ${clean}`);

      if (full.includes(LEAD_TOKEN) || emailMatch) {
        openLeadForm(emailMatch ? { email: emailMatch[0] } : {});
      }
    } catch (err) {
      if (controller.signal.aborted) {
        const partial = full.replace(LEAD_TOKEN, "").replace(ERROR_RE, "").trim();
        setAssistant(partial ? `${partial} …` : "(stopped)");
      } else {
        const message = err instanceof Error ? err.message : "Sorry, something went wrong.";
        setAssistant(message, true);
        setAnnouncement(message);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(input);
    }
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([WELCOME]);
    setShowLead(false);
    setLeadPrefill({});
    setInput("");
    setAnnouncement("Chat cleared");
    inputRef.current?.focus();
  }

  function onLeadSubmitted(name: string) {
    setLeadSubmitted(true);
    setShowLead(false);
    track("chat_lead");
    const first = name.split(" ")[0];
    const msg = `Thanks, ${first}! Your details are with our team and we'll be in touch within one business day. Anything else I can help with meanwhile?`;
    setMessages((m) => [...m, { id: uid(), role: "assistant", local: true, content: msg }]);
    setAnnouncement(msg);
  }

  const hasUserMessages = messages.some((m) => m.role === "user");
  const lastMsg = messages.at(-1);
  const waitingForFirstToken = streaming && lastMsg?.role === "assistant" && !lastMsg.content;
  const charsLeft = CHAT_MAX_MESSAGE_CHARS - input.length;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby="nova-desc"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
          onInteractOutside={(e) => e.preventDefault()}
          className={cn(
            "bg-surface/95 border-border text-fg fixed z-[80] flex flex-col overflow-hidden shadow-lg backdrop-blur-xl backdrop-saturate-150 outline-none",
            "inset-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(600px,calc(100dvh-3rem))] sm:w-[400px] sm:rounded-2xl sm:border",
            "animate-[fade-up_0.25s_var(--ease-out-quart)_both]",
          )}
        >
          {/* Header */}
          <div className="border-border flex items-center gap-3 border-b px-4 py-3">
            <div className="relative">
              <LogoMark className="size-9" />
              <span
                className="border-surface bg-success absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2"
                aria-hidden
              />
            </div>
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-sm leading-tight font-semibold">
                Nova Assistant
              </Dialog.Title>
              <p id="nova-desc" className="text-fg-muted flex items-center gap-1.5 text-xs">
                <span className="bg-success size-1.5 rounded-full" aria-hidden />
                Online · Replies instantly
              </p>
            </div>
            <button
              type="button"
              onClick={clearChat}
              aria-label="Clear chat"
              title="Clear chat"
              className="text-fg-muted hover:bg-surface-2 hover:text-fg grid size-9 place-items-center rounded-full transition-colors"
            >
              <RotateCcw className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Minimize chat"
              title="Minimize"
              className="text-fg-muted hover:bg-surface-2 hover:text-fg grid size-9 place-items-center rounded-full transition-colors"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <Dialog.Close
              aria-label="Close chat"
              title="Close"
              onClick={() => {
                abortRef.current?.abort();
                setShowLead(false);
                setInput("");
              }}
              className="text-fg-muted hover:bg-surface-2 hover:text-fg grid size-9 place-items-center rounded-full transition-colors"
            >
              <X className="size-4" aria-hidden />
            </Dialog.Close>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            onScroll={onScroll}
            role="log"
            aria-label="Conversation"
            className="bg-bg/50 flex flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-5"
          >
            {messages.map((m) =>
              m.role === "assistant" ? (
                m.content || !streaming || m.id !== lastMsg?.id ? (
                  <div key={m.id} className="flex items-start gap-2.5">
                    <LogoMark className="mt-0.5 size-6.5 shrink-0" />
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl rounded-tl-md border px-3.5 py-2.5 text-[0.9375rem] leading-relaxed",
                        m.error
                          ? "border-error/40 bg-error/5 text-fg"
                          : "border-border bg-surface text-fg-muted",
                      )}
                    >
                      <ChatMarkdown text={m.content} onInternalLink={() => onOpenChange(false)} />
                    </div>
                  </div>
                ) : null
              ) : (
                <div key={m.id} className="flex justify-end">
                  <div className="bg-surface-3 text-fg max-w-[85%] rounded-2xl rounded-tr-md px-3.5 py-2.5 text-[0.9375rem] leading-relaxed break-words whitespace-pre-wrap">
                    {m.content}
                  </div>
                </div>
              ),
            )}

            {waitingForFirstToken ? (
              <div className="flex items-center gap-2.5" aria-label="Nova is typing">
                <LogoMark className="size-6.5 shrink-0" />
                <div className="border-border bg-surface flex gap-1 rounded-2xl rounded-tl-md border px-4 py-3.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="bg-fg-subtle size-1.5 animate-bounce rounded-full"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {!hasUserMessages ? (
              <div
                className="ml-9 flex flex-wrap gap-2"
                role="group"
                aria-label="Suggested questions"
              >
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void send(q)}
                    className="border-border-strong bg-surface text-fg hover:border-accent hover:bg-accent-soft hover:text-accent-text rounded-full border px-3 py-1.5 text-left text-sm transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            ) : null}

            {showLead && !leadSubmitted ? (
              <ChatLeadForm
                initial={leadPrefill}
                transcript={transcript}
                onSubmitted={onLeadSubmitted}
                onDismiss={() => setShowLead(false)}
              />
            ) : null}

            {leadSubmitted && !showLead ? (
              <div className="ml-9">
                <WhatsAppButton />
              </div>
            ) : null}
          </div>

          {/* Screen-reader announcements for completed messages (streaming tokens are not announced). */}
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {announcement}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="border-border bg-surface/80 border-t p-3"
          >
            <div className="border-border-strong bg-surface focus-within:border-accent focus-within:ring-accent-soft flex items-end gap-2 rounded-2xl border p-1.5 pl-3.5 transition-[border-color,box-shadow] focus-within:ring-4">
              <label htmlFor="nova-input" className="sr-only">
                Message Nova
              </label>
              <textarea
                id="nova-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={CHAT_MAX_MESSAGE_CHARS}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about services, process, pricing…"
                className="text-fg placeholder:text-fg-subtle max-h-40 min-h-9 flex-1 resize-none bg-transparent py-2 text-[0.9375rem] focus:outline-none"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  aria-label="Stop generating"
                  className="bg-surface-3 text-fg hover:bg-border-strong grid size-9 shrink-0 place-items-center rounded-xl transition-colors"
                >
                  <Square className="size-3.5 fill-current" aria-hidden />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="bg-accent text-accent-fg hover:bg-accent-hover disabled:bg-surface-3 disabled:text-fg-subtle grid size-9 shrink-0 place-items-center rounded-xl transition-colors"
                >
                  <ArrowUp className="size-4" aria-hidden />
                </button>
              )}
            </div>
            <div className="text-fg-subtle mt-1.5 flex justify-between px-1 text-[0.6875rem]">
              <span>Enter to send · Shift+Enter for a new line</span>
              {charsLeft < 200 ? (
                <span aria-live="polite">{charsLeft} left</span>
              ) : (
                <span>AI can make mistakes</span>
              )}
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
