"use client";

/** Shimmering placeholder shown while the (mock) z.ai lookup resolves. */
export default function ResultsSkeleton() {
  return (
    <div className="mx-auto min-h-[100svh] max-w-6xl px-5 pt-28 sm:px-8">
      <div className="skeleton animate-shimmer h-4 w-28 rounded-full" />
      <div className="skeleton animate-shimmer mt-4 h-14 w-2/3 rounded-2xl" />
      <div className="skeleton animate-shimmer mt-3 h-4 w-1/2 rounded-full" />

      <div className="mt-10 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton animate-shimmer h-10 w-32 rounded-full"
          />
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton animate-shimmer h-44 rounded-3xl"
          />
        ))}
      </div>
    </div>
  );
}
