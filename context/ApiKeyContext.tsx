"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "wanderlust:zai_key";

type ApiKeyContextValue = {
  /** The stored z.ai key, or null if not set yet. */
  apiKey: string | null;
  /** True once a non-empty key has been saved. Gates the search experience. */
  hasKey: boolean;
  /** True until we've read localStorage (avoids SSR/client flicker). */
  ready: boolean;
  saveKey: (key: string) => void;
  clearKey: () => void;
};

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null);

/**
 * Bring-Your-Own-Key store for the user's z.ai API key.
 * The key never ships with the app — it lives only in the visitor's browser
 * (localStorage) and is attached to outbound requests at call time.
 */
export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setApiKey(stored);
    } catch {
      /* localStorage unavailable (private mode) — degrade gracefully */
    }
    setReady(true);
  }, []);

  const saveKey = useCallback((key: string) => {
    const trimmed = key.trim();
    setApiKey(trimmed || null);
    try {
      if (trimmed) window.localStorage.setItem(STORAGE_KEY, trimmed);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const clearKey = useCallback(() => {
    setApiKey(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        hasKey: Boolean(apiKey),
        ready,
        saveKey,
        clearKey,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return ctx;
}
