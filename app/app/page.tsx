"use client";

import { useState } from "react";
import FormatSelector from "@/components/FormatSelector";
import ImageResult from "@/components/ImageResult";
import { FORMATS, Format, FormatId } from "@/lib/formats";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [selectedFormatId, setSelectedFormatId] = useState<FormatId>("meta-feed");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedFormat: Format = FORMATS.find((f) => f.id === selectedFormatId)!;

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, format: selectedFormatId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Erreur inconnue");

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la génération");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#1f0942] px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight text-white">
            Digi<span className="text-[#864dff]">design</span>
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Générateur d&apos;images · Nano Banana 2
          </p>
        </div>

        {/* Format selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-widest text-white/40">
            Format
          </label>
          <FormatSelector selected={selectedFormatId} onChange={setSelectedFormatId} />
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          <label
            htmlFor="prompt"
            className="text-xs font-medium uppercase tracking-widest text-white/40"
          >
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
            }}
            placeholder="Décris l'image à générer…"
            rows={4}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#864dff]"
          />
          <p className="text-right text-[10px] text-white/20">⌘ + Entrée pour générer</p>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="w-full rounded-xl bg-[#864dff] py-3 text-sm font-bold text-white transition-all hover:bg-[#7340e0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? "Génération…" : "Générer l'image"}
        </button>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-[#fe695d]/30 bg-[#fe695d]/10 px-4 py-3 text-sm text-[#fe695d]">
            {error}
          </div>
        )}

        {/* Result */}
        <ImageResult imageUrl={imageUrl} isLoading={isLoading} format={selectedFormat} />

      </div>
    </main>
  );
}
