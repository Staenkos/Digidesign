import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

const FORMAT_SIZES: Record<string, { width: number; height: number }> = {
  "meta-feed": { width: 1080, height: 1080 },
  "meta-portrait": { width: 1080, height: 1350 },
  "meta-stories": { width: 1080, height: 1920 },
  "linkedin-feed": { width: 1200, height: 627 },
};

const BRAND_PROMPT =
  "Digiforma brand style: professional French SaaS platform for training organizations. " +
  "Clean modern design using violet (#864dff), navy (#1f0942), off-white (#faf6ff). " +
  "Bold Satoshi typography, expert yet approachable, polished and contemporary visual identity.";

export async function POST(req: NextRequest) {
  try {
    const { prompt, format, inspirationImages } = await req.json();

    if (!prompt || !format) {
      return NextResponse.json({ error: "Prompt et format requis" }, { status: 400 });
    }

    const size = FORMAT_SIZES[format];
    if (!size) {
      return NextResponse.json({ error: "Format invalide" }, { status: 400 });
    }

    fal.config({ credentials: process.env.GEMINI_KEY ?? process.env.FAL_KEY });

    const hasInspirations = Array.isArray(inspirationImages) && inspirationImages.length > 0;
    const enhancedPrompt =
      `${BRAND_PROMPT} ${prompt}` +
      (hasInspirations ? " Inspired by the provided composition references." : "");

    const results = await Promise.all(
      Array.from({ length: 3 }, () =>
        fal.run("fal-ai/nano-banana-2", {
          input: {
            prompt: enhancedPrompt,
            image_size: { width: size.width, height: size.height },
            num_inference_steps: 4,
            enable_safety_checker: true,
          },
        })
      )
    );

    const imageUrls = results
      .map((r) => (r as { images?: { url: string }[] }).images?.[0]?.url)
      .filter((u): u is string => Boolean(u));

    if (imageUrls.length === 0) {
      return NextResponse.json({ error: "Aucune image générée" }, { status: 500 });
    }

    return NextResponse.json({ imageUrls });
  } catch (err) {
    console.error("Erreur génération :", err);
    return NextResponse.json({ error: "Erreur lors de la génération" }, { status: 500 });
  }
}
