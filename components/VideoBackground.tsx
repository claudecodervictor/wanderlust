"use client";

/**
 * Full-bleed looping video wallpaper with a cinematic gradient scrim so
 * foreground glass panels and text stay legible over any frame.
 *
 * Uses a free Pexels-hosted clip. Swap `VIDEO_SRC` for any other royalty-free
 * source; a high-res still is used as the poster + fallback.
 */
const VIDEO_SRC =
  "https://videos.pexels.com/video-files/2169880/2169880-uhd_3840_2160_30fps.mp4";

const POSTER =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80";

export default function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-ink-900">
      <video
        className="h-full w-full scale-105 object-cover opacity-70 animate-slow-zoom"
        autoPlay
        muted
        loop
        playsInline
        poster={POSTER}
        preload="auto"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Layered scrims: darken edges, lift center contrast, warm the base */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/35 to-ink-900/90" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_30%,rgba(10,10,12,0.65)_100%)]" />
      {/* subtle film grain via repeating gradient — keeps it from looking flat/AI-smooth */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_2px)]" />
    </div>
  );
}
