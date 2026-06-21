import type { LocationGuide } from "./types";
import { buildMockGuide } from "./mockData";

/**
 * Toggle this to `false` once the real z.ai-backed endpoint is wired up.
 * While true, we return mocked data so the UI is fully usable immediately.
 */
const USE_MOCK = true;

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
    if (res.status === 401) {
      throw new Error("That z.ai key was rejected. Double-check it and retry.");
    }
    throw new Error(`Lookup failed (${res.status}). Please try again.`);
  }

  return (await res.json()) as LocationGuide;
}
