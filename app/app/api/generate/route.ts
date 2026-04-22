import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

const FORMAT_SIZES: Record<string, { width: number; height: number }> = {
  "meta-feed": { width: 1080, height: 1080 },
  "meta-portrait": { width: 1080, height: 1350 },
  "meta-stories": { width: 1080, height: 1920 },
  "linkedin-feed": { width: 1200, height: 627 },
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, format } = await req.json();

    if (!prompt || !format) {
      return NextResponse.json({ error: "Prompt et format requis" }, { status: 400 });
    }

    const size = FORMAT_SIZES[format];
    if (!size) {
      return NextResponse.json({ error: "Format invalide" }, { status: 400 });
    }

    fal.config({ credentials: process.env.FAL_KEY });

    const result = await fal.run("fal-ai/nano-banana-2", {
      input: {
        prompt,
        image_size: { width: size.width, height: size.height },
        num_inference_steps: 4,
        enable_safety_checker: true,
      },
    });

    const output = result as { images?: { url: string }[] };
    const imageUrl = output.images?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: "Aucune image générée" }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error("Erreur génération :", err);
    return NextResponse.json({ error: "Erreur lors de la génération" }, { status: 500 });
  }
}
