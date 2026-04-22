"use client";

import { Format } from "@/lib/formats";

interface Props {
  imageUrls: string[];
  format: Format;
}

const ASPECT_CLASSES: Record<string, string> = {
  "meta-feed": "aspect-square",
  "meta-portrait": "aspect-[4/5]",
  "meta-stories": "aspect-[9/16]",
  "linkedin-feed": "aspect-[191/100]",
};

export default function ImageResult({ imageUrls, format }: Props) {
  const aspectClass = ASPECT_CLASSES[format.id] ?? "aspect-square";

  return (
    <div className="space-y-4">
      <p className="text-xs font-medium uppercase tracking-widest text-[#1f0942]/50">
        {imageUrls.length} variante{imageUrls.length > 1 ? "s" : ""} générée
        {imageUrls.length > 1 ? "s" : ""}
      </p>
      <div
        className={`grid gap-4 ${
          imageUrls.length >= 3
            ? "grid-cols-3"
            : imageUrls.length === 2
            ? "grid-cols-2"
            : "grid-cols-1 max-w-sm mx-auto"
        }`}
      >
        {imageUrls.map((url, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className={`relative w-full overflow-hidden rounded-xl border border-[#864dff]/20 bg-white/40 shadow-sm ${aspectClass}`}
            >
              <img
                src={url}
                alt={`Variante ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
            <a
              href={url}
              download={`digidesign-${format.id}-v${i + 1}.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-[#864dff] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              V{i + 1} · {format.sublabel}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
