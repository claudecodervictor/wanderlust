import { NextResponse } from "next/server";
import type { LocationGuide } from "@/lib/types";

/**
 * Server route that turns a place name into a real, location-specific travel
 * guide by calling z.ai (Zhipu GLM — OpenAI-compatible chat completions).
 *
 * The visitor's z.ai key is passed through as `Authorization: Bearer <key>`
 * and used only for this request — it's never stored or logged server-side.
 */

// z.ai is OpenAI-compatible. Endpoint + model are overridable via env.
const ZAI_URL =
  process.env.ZAI_BASE_URL ?? "https://api.z.ai/api/paas/v4/chat/completions";
// glm-4.5-flash is z.ai's free model (no balance required). Override with
// ZAI_MODEL=glm-4.6 (or another paid model) once the key has credit.
const ZAI_MODEL = process.env.ZAI_MODEL ?? "glm-4.5-flash";

export const runtime = "nodejs";
// Generating a full guide can take a little while — give it room.
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a seasoned local travel guide and cultural anthropologist.
Given a place (city, region, or country), return a rich, ACCURATE, and SPECIFIC
guide to THAT place — never generic filler. Use real, named attractions, real
signature dishes, true cultural norms and history, and the actual languages and
phrases used there (with correct pronunciation).

Respond with ONLY a single JSON object (no markdown, no prose, no code fences)
matching exactly this TypeScript type:

{
  "location": string,        // the canonical place name you described
  "country": string,         // the country it sits in
  "tagline": string,         // one evocative sentence capturing its character
  "heroImage": string,       // "" (leave empty)
  "attractions": [           // exactly 4, real and named
    { "name": string, "blurb": string, "tag": string, "bestTime": string }
  ],
  "cuisine": [               // exactly 4 real dishes/drinks
    { "name": string, "description": string, "emoji": string,
      "kind": "Street food" | "Main" | "Dessert" | "Drink" }
  ],
  "culture": {
    "history": string,       // 2-4 sentences, real history of this place
    "norms": [               // exactly 4 genuine local customs/etiquette
      { "title": string, "detail": string }
    ]
  },
  "language": {
    "primary": string[],     // the actual language(s) spoken there
    "phrases": [             // exactly 4 useful phrases in the local language
      { "original": string, "pronunciation": string, "meaning": string }
    ]
  }
}

Keep each blurb/description to 1-2 vivid sentences. Pick one fitting emoji per
dish. If the input is not a real place, pick the closest real interpretation.`;

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Pull a JSON object out of a model response that may include stray text. */
function extractJson(content: string): unknown {
  const trimmed = content.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Model did not return valid JSON.");
  }
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const apiKey = auth.replace(/^Bearer\s+/i, "").trim();
  if (!apiKey) {
    return badRequest("A z.ai API key is required.", 401);
  }

  let location = "";
  try {
    const body = await req.json();
    location = String(body?.location ?? "").trim();
  } catch {
    return badRequest("Invalid request body.");
  }
  if (!location) {
    return badRequest("Please enter a location.");
  }

  let upstream: Response;
  try {
    upstream = await fetch(ZAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: ZAI_MODEL,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Create the travel guide for: ${location}` },
        ],
      }),
    });
  } catch {
    return badRequest("Couldn't reach z.ai. Please try again.", 502);
  }

  if (!upstream.ok) {
    if (upstream.status === 401 || upstream.status === 403) {
      return badRequest(
        "That z.ai key was rejected. Double-check it and retry.",
        401,
      );
    }
    const detail = await upstream.text().catch(() => "");
    // 1113 = insufficient balance / no resource package on the z.ai account.
    if (upstream.status === 429 || detail.includes("1113")) {
      return badRequest(
        "Your z.ai account is out of credit for this model. Add credit, or set ZAI_MODEL to a free model like glm-4.5-flash.",
        429,
      );
    }
    return badRequest(
      `z.ai request failed (${upstream.status}).${detail ? ` ${detail.slice(0, 200)}` : ""}`,
      502,
    );
  }

  let guide: LocationGuide;
  try {
    const data = await upstream.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    if (!content) throw new Error("Empty response from z.ai.");
    guide = extractJson(content) as LocationGuide;
  } catch {
    return badRequest(
      "z.ai returned an unexpected response. Please try again.",
      502,
    );
  }

  return NextResponse.json(guide);
}
