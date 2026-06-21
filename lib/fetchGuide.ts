import type { LocationGuide } from "./types";
import { buildMockGuide } from "./mockData";

/**
 * Live by default: searches hit `/api/guide`, which proxies the visitor's z.ai
 * key to GLM and returns a real, location-specific guide. Flip to `true` to
 * fall back to mocked data (e.g. for offline UI work).
 */
const USE_MOCK = false;

export type FetchGuideArgs = {
  location: string;
  apiKey: string;
};

/**
 * Fetches a culture/travel guide for a location.
 *
 * The z.ai key is Bring-Your-Own-Key: it's supplied by the visitor and passed
 * through at call time — never bundled into the app. When wiring the live API,
 * keep the key out of the URL/logs; send it as an Authorization header to a
 * server route that proxies z.ai.
 */
export async function fetchGuide({
  location,
  apiKey,
}: FetchGuideArgs): Promise<LocationGuide> {
  if (!location.trim()) {
    throw new Error("Please enter a location.");
  }
  if (!apiKey) {
    throw new Error("A z.ai API key is required.");
  }

  if (USE_MOCK) {
    // Simulate realistic network latency so the loading state is visible.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    return buildMockGuide(location);
  }

  // --- Live path (enabled when USE_MOCK = false) -------------------------
  // Recommended: call an internal API route that forwards to z.ai so the key
  // isn't exposed in client network traces beyond the user's own session.
  const res = await fetch("/api/guide", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ location }),
  });

  if (!res.ok) {
    const message = await res
      .json()
      .then((data) => data?.error as string | undefined)
      .catch(() => undefined);
    throw new Error(message ?? `Lookup failed (${res.status}). Please try again.`);
  }

  return (await res.json()) as LocationGuide;
}
