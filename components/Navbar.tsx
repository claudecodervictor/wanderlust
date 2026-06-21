"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApiKey } from "@/context/ApiKeyContext";

export default function Navbar() {
  const { hasKey, apiKey, saveKey, clearKey, ready } = useApiKey();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close the popover on outside-click / Escape.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    saveKey(draft);
    setDraft("");
    setOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Wordmark */}
        <a href="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl glass-light text-lg">
            🧭
          </span>
          <span className="font-display text-xl tracking-tight text-sand-50">
            Wanderlust
          </span>
        </a>

        {/* z.ai key gatekeeper — top right */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="glass-light flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-sand-50 transition-colors hover:bg-white/15"
            aria-expanded={open}
          >
            <span
              className={`h-2 w-2 rounded-full transition-colors ${
                !ready
                  ? "bg-white/30"
                  : hasKey
                    ? "bg-jade shadow-[0_0_10px_2px_rgba(57,211,160,0.6)]"
                    : "bg-ember shadow-[0_0_10px_2px_rgba(255,122,69,0.6)]"
              }`}
            />
            <span className="hidden sm:inline">
              {hasKey ? "z.ai connected" : "Add z.ai key"}
            </span>
            <span className="sm:hidden">{hasKey ? "Connected" : "Key"}</span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="glass absolute right-0 mt-3 w-80 rounded-2xl p-5"
              >
                <h3 className="font-display text-lg text-sand-50">
                  Bring your own z.ai key
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-sand-100/70">
                  Your key is stored only in this browser and sent directly with
                  your searches. It never touches our servers.
                </p>

                <form onSubmit={handleSave} className="mt-4">
                  <input
                    type="password"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="zai-xxxxxxxxxxxxxxxx"
                    autoFocus
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-sand-50 placeholder:text-sand-100/30 outline-none transition focus:border-jade/60 focus:ring-2 focus:ring-jade/20"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="mt-3 w-full rounded-xl bg-gradient-to-r from-ember to-amber-400 px-4 py-2.5 text-sm font-semibold text-ink-900 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {hasKey ? "Update key" : "Unlock search"}
                  </button>
                </form>

                {hasKey && (
                  <div className="mt-3 flex items-center justify-between text-xs text-sand-100/60">
                    <span>
                      Saved ····{apiKey?.slice(-4)}
                    </span>
                    <button
                      onClick={() => {
                        clearKey();
                        setOpen(false);
                      }}
                      className="text-ember/90 transition hover:text-ember"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
