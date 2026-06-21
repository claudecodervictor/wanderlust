"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useApiKey } from "@/context/ApiKeyContext";

type Props = {
  onSearch: (location: string) => void;
  loading: boolean;
};

const SUGGESTIONS = ["Kyoto", "Marrakech", "Lisbon", "Oaxaca", "Hanoi"];

export default function SearchHero({ onSearch, loading }: Props) {
  const { hasKey } = useApiKey();
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasKey || !value.trim() || loading) return;
    onSearch(value.trim());
  }

  return (
    <section className="relative mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-5 text-center">
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-5 inline-flex items-center gap-2 rounded-full glass-light px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-sand-100/80"
      >
        Travel · Culture · Discovery
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-5xl leading-[1.02] tracking-tight text-balance text-sand-50 sm:text-7xl"
      >
        Explore the <span className="text-gradient italic">soul</span> of
        <br className="hidden sm:block" /> any place on Earth
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 max-w-xl text-balance text-base text-sand-100/75 sm:text-lg"
      >
        Attractions, cuisine, customs, history and language — a living guide to
        anywhere, the moment you ask.
      </motion.p>

      {/* Search bar */}
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 w-full max-w-2xl"
      >
        <div
          className={`glass group relative flex items-center gap-3 rounded-2xl p-2 pl-5 transition ${
            !hasKey ? "opacity-90" : ""
          }`}
        >
          <svg
            className="h-5 w-5 shrink-0 text-sand-100/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!hasKey || loading}
            placeholder={
              hasKey ? "Enter a location" : "Add your z.ai key to start exploring"
            }
            className="w-full bg-transparent py-3 text-lg text-sand-50 placeholder:text-sand-100/40 outline-none disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={!hasKey || !value.trim() || loading}
            className="shrink-0 rounded-xl bg-gradient-to-r from-ember to-amber-400 px-6 py-3 text-sm font-semibold text-ink-900 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Exploring…" : "Explore"}
          </button>
        </div>

        {/* Lock notice / suggestions */}
        <div className="mt-4 flex min-h-[28px] items-center justify-center gap-2 text-sm">
          {!hasKey ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 text-sand-100/70"
            >
              <svg
                className="h-4 w-4 text-ember"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 10V7a4 4 0 10-8 0v3M6 10h12v9a1 1 0 01-1 1H7a1 1 0 01-1-1v-9z"
                />
              </svg>
              Search is locked — add your z.ai key from the top-right corner.
            </motion.span>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sand-100/40">Try</span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setValue(s);
                    onSearch(s);
                  }}
                  className="rounded-full glass-light px-3 py-1 text-xs text-sand-50 transition hover:bg-white/15"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.form>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-sand-100/40"
      >
        Scroll to wander
      </motion.div>
    </section>
  );
}
