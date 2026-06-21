"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LocationGuide } from "@/lib/types";

type Category = "attractions" | "cuisine" | "culture" | "language";

const TABS: { id: Category; label: string; icon: string }[] = [
  { id: "attractions", label: "Attractions", icon: "📍" },
  { id: "cuisine", label: "Cuisine", icon: "🍜" },
  { id: "culture", label: "Culture & History", icon: "🏛️" },
  { id: "language", label: "Language", icon: "💬" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function ResultsDashboard({
  guide,
  onReset,
}: {
  guide: LocationGuide;
  onReset: () => void;
}) {
  const [active, setActive] = useState<Category>("attractions");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="relative mx-auto min-h-[100svh] max-w-6xl px-5 pb-24 pt-28 sm:px-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            onClick={onReset}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-sand-100/60 transition hover:text-sand-50"
          >
            <span aria-hidden>←</span> New search
          </button>
          <p className="text-xs uppercase tracking-[0.25em] text-jade">
            Your guide to
          </p>
          <h2 className="font-display text-5xl tracking-tight text-sand-50 sm:text-6xl">
            {guide.location}
          </h2>
          <p className="mt-3 max-w-xl text-balance text-sand-100/70">
            {guide.tagline}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                isActive ? "text-ink-900" : "text-sand-50 hover:bg-white/10"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-sand-50"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease }}
          >
            {active === "attractions" && <AttractionsPanel guide={guide} />}
            {active === "cuisine" && <CuisinePanel guide={guide} />}
            {active === "culture" && <CulturePanel guide={guide} />}
            {active === "language" && <LanguagePanel guide={guide} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ------------------------------ Panels ------------------------------ */

function stagger(i: number) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: i * 0.06, ease },
  };
}

function AttractionsPanel({ guide }: { guide: LocationGuide }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {guide.attractions.map((a, i) => (
        <motion.article
          key={a.name}
          {...stagger(i)}
          className="glass glass-hover group rounded-3xl p-6"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-sand-100/80">
              {a.tag}
            </span>
            <span className="text-xs text-jade">Best: {a.bestTime}</span>
          </div>
          <h3 className="mt-4 font-display text-2xl text-sand-50">{a.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-sand-100/70">
            {a.blurb}
          </p>
        </motion.article>
      ))}
    </div>
  );
}

function CuisinePanel({ guide }: { guide: LocationGuide }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {guide.cuisine.map((d, i) => (
        <motion.article
          key={d.name}
          {...stagger(i)}
          className="glass glass-hover flex flex-col rounded-3xl p-6"
        >
          <span className="text-4xl">{d.emoji}</span>
          <span className="mt-4 text-[11px] uppercase tracking-widest text-ember">
            {d.kind}
          </span>
          <h3 className="mt-1 font-display text-xl text-sand-50">{d.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-sand-100/70">
            {d.description}
          </p>
        </motion.article>
      ))}
    </div>
  );
}

function CulturePanel({ guide }: { guide: LocationGuide }) {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <motion.div
        {...stagger(0)}
        className="glass rounded-3xl p-7 lg:col-span-2"
      >
        <h3 className="font-display text-2xl text-sand-50">A short history</h3>
        <p className="mt-3 text-sm leading-relaxed text-sand-100/75">
          {guide.culture.history}
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
        {guide.culture.norms.map((n, i) => (
          <motion.div
            key={n.title}
            {...stagger(i + 1)}
            className="glass glass-hover rounded-3xl p-6"
          >
            <h4 className="font-display text-lg text-sand-50">{n.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-sand-100/70">
              {n.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LanguagePanel({ guide }: { guide: LocationGuide }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <motion.div {...stagger(0)} className="glass rounded-3xl p-7">
        <h3 className="font-display text-2xl text-sand-50">
          Languages spoken
        </h3>
        <ul className="mt-4 space-y-2">
          {guide.language.primary.map((lang) => (
            <li
              key={lang}
              className="flex items-center gap-2.5 text-sm text-sand-100/80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-jade" />
              {lang}
            </li>
          ))}
        </ul>
      </motion.div>

      <div className="grid gap-3 lg:col-span-2">
        {guide.language.phrases.map((p, i) => (
          <motion.div
            key={p.original}
            {...stagger(i + 1)}
            className="glass glass-hover flex items-center justify-between gap-4 rounded-2xl p-5"
          >
            <div>
              <p className="font-display text-xl text-sand-50">{p.original}</p>
              <p className="text-xs italic text-sand-100/50">
                {p.pronunciation}
              </p>
            </div>
            <p className="max-w-[50%] text-right text-sm text-sand-100/75">
              {p.meaning}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
