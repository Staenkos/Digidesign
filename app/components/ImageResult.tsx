"use client";

import { Format } from "@/lib/formats";

interface Props {
  imageUrl: string | null;
  isLoading: boolean;
  format: Format;
}

const ASPECT_CLASSES: Record<string, string> = {
  "meta-feed": "aspect-square",
  "meta-portrait": "aspect-[4/5]",
  "meta-stories": "aspect-[9/16]",
  "linkedin-feed": "aspect-[191/100]",
};

export default function ImageResult({ imageUrl, isLoading, format }: Props) {
  const aspectClass = ASPECT_CLASSES[format.id] ?? "aspect-square";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-white/5 ${aspectClass}`}
      >
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#864dff]" />
            <p className="text-sm text-white/40">Génération en cours…</p>
          </div>
        )}
        {!isLoading && imageUrl && (
          <img
            src={imageUrl}
            alt="Image générée"
            className="h-full w-full object-cover"
          />
        )}
        {!isLoading && !imageUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <p className="text-xs">L&apos;image apparaîtra ici</p>
          </div>
        )}
      </div>

      {imageUrl && !isLoading && (
        <a
          href={imageUrl}
          download={`digidesign-${format.id}.png`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-[#864dff] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Télécharger ({format.sublabel})
        </a>
      )}
    </div>
  );
}
