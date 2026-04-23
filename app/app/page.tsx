"use client";

import { useState, useRef, useCallback } from "react";
import FormatSelector from "@/components/FormatSelector";
import ImageResult from "@/components/ImageResult";
import { FORMATS, Format, FormatId } from "@/lib/formats";

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function DropZone({
  label,
  sublabel,
  files,
  onFiles,
  maxFiles,
  accept,
}: {
  label: string;
  sublabel: string;
  files: File[];
  onFiles: (files: File[]) => void;
  maxFiles: number;
  accept: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files).slice(0, maxFiles);
      onFiles(dropped);
    },
    [maxFiles, onFiles]
  );

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
        isDragging
          ? "border-[#864dff] bg-[#864dff]/10"
          : "border-[#864dff]/30 bg-white/50 hover:border-[#864dff]/60 hover:bg-white/70"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => onFiles(Array.from(e.target.files ?? []).slice(0, maxFiles))}
      />
      {files.length === 0 ? (
        <>
          <div className="text-3xl mb-2">📸</div>
          <p className="text-sm font-semibold text-[#1f0942]">{label}</p>
          <p className="text-xs text-[#1f0942]/50 mt-1">{sublabel}</p>
        </>
      ) : (
        <div className="flex flex-wrap gap-2 justify-center items-end">
          {files.map((f, i) => (
            <img
              key={i}
              src={URL.createObjectURL(f)}
              alt={f.name}
              className="h-16 w-16 rounded-lg object-cover border border-[#864dff]/20"
            />
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFiles([]);
            }}
            className="text-xs text-[#864dff] underline self-center ml-1"
          >
            Effacer
          </button>
        </div>
      )}
    </div>
  );
}

function SectionLabel({
  num,
  children,
  optional,
}: {
  num: number;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#1f0942]/50">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
          optional ? "bg-[#864dff]/20 text-[#864dff]" : "bg-[#864dff] text-white"
        }`}
      >
        {num}
      </span>
      {children}
      {optional && (
        <span className="text-[10px] text-[#1f0942]/30 normal-case tracking-normal">
          (facultatif)
        </span>
      )}
    </label>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [selectedFormatId, setSelectedFormatId] = useState<FormatId>("meta-feed");
  const [sourceImages, setSourceImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedFormat: Format = FORMATS.find((f) => f.id === selectedFormatId)!;

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setImageUrls([]);

    try {
      const sourceBase64 = await Promise.all(sourceImages.map(fileToBase64));

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          format: selectedFormatId,
          sourceImages: sourceBase64,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur inconnue");
      setImageUrls(data.imageUrls ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la génération");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#faf6ff]/90 backdrop-blur-sm">
          <video
            src="/videos/animation_loader.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-48 h-48 object-contain"
          />
          <p className="mt-3 text-sm font-semibold text-[#864dff]">
            Génération des 3 variantes…
          </p>
        </div>
      )}

      <main
        className="min-h-screen px-4 py-12"
        style={{
          background: "linear-gradient(135deg, #faf6ff 0%, #eee0ff 55%, #c4a0ff 100%)",
        }}
      >
        <div className="mx-auto max-w-2xl space-y-8">

          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight text-[#1f0942]">
              Digi<span className="text-[#864dff]">design</span>
            </h1>
            <p className="mt-1 text-sm text-[#1f0942]/40">
              Générateur d&apos;images · Nano Banana 2
            </p>
          </div>

          <div className="space-y-2">
            <SectionLabel num={1}>Photos sources</SectionLabel>
            <DropZone
              label="Glissez-déposez vos photos ici"
              sublabel="ou cliquez pour les sélectionner (jusqu'à 5, JPG/PNG/WebP)"
              files={sourceImages}
              onFiles={setSourceImages}
              maxFiles={5}
              accept=".jpg,.jpeg,.png,.webp"
            />
          </div>

          <div className="space-y-2">
            <SectionLabel num={2}>Format</SectionLabel>
            <FormatSelector selected={selectedFormatId} onChange={setSelectedFormatId} />
          </div>

          <div className="space-y-2">
            <SectionLabel num={3}>Prompt</SectionLabel>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
              }}
              placeholder="Décris l'image à générer…"
              rows={4}
              className="w-full resize-none rounded-xl border border-[#864dff]/20 bg-white/60 px-4 py-3 text-sm text-[#1f0942] placeholder-[#1f0942]/30 outline-none transition-colors focus:border-[#864dff]"
            />
            <p className="text-right text-[10px] text-[#1f0942]/30">⌘ + Entrée pour générer</p>
          </div>


          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full rounded-xl bg-[#864dff] py-3 text-sm font-bold text-white shadow-lg shadow-[#864dff]/30 transition-all hover:bg-[#7340e0] hover:shadow-[#864dff]/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Générer 3 variantes
          </button>

          {error && (
            <div className="rounded-xl border border-[#fe695d]/30 bg-[#fe695d]/10 px-4 py-3 text-sm text-[#fe695d]">
              {error}
            </div>
          )}

          {imageUrls.length > 0 && (
            <ImageResult imageUrls={imageUrls} format={selectedFormat} />
          )}

        </div>
      </main>
    </>
  );
}
