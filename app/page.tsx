"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import VideoBackground from "@/components/VideoBackground";
import SearchHero from "@/components/SearchHero";
import ResultsDashboard from "@/components/ResultsDashboard";
import ResultsSkeleton from "@/components/ResultsSkeleton";
import { useApiKey } from "@/context/ApiKeyContext";
import { fetchGuide } from "@/lib/fetchGuide";
import type { LocationGuide } from "@/lib/types";

type View = "landing" | "loading" | "results";

export default function Home() {
  const { apiKey } = useApiKey();
  const [view, setView] = useState<View>("landing");
  const [guide, setGuide] = useState<LocationGuide | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(location: string) {
    setError(null);
    setView("loading");
    try {
      const result = await fetchGuide({ location, apiKey: apiKey ?? "" });
      setGuide(result);
      setView("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setView("landing");
    }
  }

  function reset() {
    setGuide(null);
    setView("landing");
  }

  return (
    <main className="relative min-h-[100svh]">
      <VideoBackground />
      <Navbar />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed left-1/2 top-20 z-40 -translate-x-1/2 rounded-full glass px-5 py-2.5 text-sm text-ember"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SearchHero onSearch={handleSearch} loading={false} />
          </motion.div>
        )}

        {view === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ResultsSkeleton />
          </motion.div>
        )}

        {view === "results" && guide && (
          <motion.div key="results">
            <ResultsDashboard guide={guide} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
