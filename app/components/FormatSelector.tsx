"use client";

import { FORMATS, Format, FormatId } from "@/lib/formats";

interface Props {
  selected: FormatId;
  onChange: (id: FormatId) => void;
}

const RATIO_PREVIEWS: Record<FormatId, string> = {
  "meta-feed": "aspect-square",
  "meta-portrait": "aspect-[4/5]",
  "meta-stories": "aspect-[9/16]",
  "linkedin-feed": "aspect-[191/100]",
};

export default function FormatSelector({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {FORMATS.map((format: Format) => {
        const isActive = selected === format.id;
        return (
          <button
            key={format.id}
            onClick={() => onChange(format.id)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
              isActive
                ? "border-[#864dff] bg-[#864dff]/10"
                : "border-[#864dff]/20 bg-white/50 hover:border-[#864dff]/50 hover:bg-white/70"
            }`}
          >
            <div className="flex h-12 w-full items-center justify-center">
              <div
                className={`${RATIO_PREVIEWS[format.id]} max-h-10 max-w-10 rounded-sm ${
                  isActive ? "bg-[#864dff]" : "bg-[#864dff]/20"
                }`}
                style={{ width: "auto", height: "auto", maxWidth: "40px", maxHeight: "40px" }}
              />
            </div>
            <div className="text-center">
              <p
                className={`text-xs font-bold tracking-wide ${
                  isActive ? "text-[#864dff]" : "text-[#1f0942]/50"
                }`}
              >
                {format.label}
              </p>
              <p className={`text-[10px] ${isActive ? "text-[#1f0942]" : "text-[#1f0942]/40"}`}>
                {format.ratio}
              </p>
              <p className={`text-[10px] ${isActive ? "text-[#1f0942]/60" : "text-[#1f0942]/30"}`}>
                {format.sublabel}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
