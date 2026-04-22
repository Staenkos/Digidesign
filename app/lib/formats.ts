export type FormatId = "meta-feed" | "meta-portrait" | "meta-stories" | "linkedin-feed";

export interface Format {
  id: FormatId;
  label: string;
  sublabel: string;
  width: number;
  height: number;
  ratio: string;
}

export const FORMATS: Format[] = [
  {
    id: "meta-feed",
    label: "META FEED",
    sublabel: "1080 × 1080 px",
    width: 1080,
    height: 1080,
    ratio: "1:1",
  },
  {
    id: "meta-portrait",
    label: "META PORTRAIT",
    sublabel: "1080 × 1350 px",
    width: 1080,
    height: 1350,
    ratio: "4:5",
  },
  {
    id: "meta-stories",
    label: "META STORIES",
    sublabel: "1080 × 1920 px",
    width: 1080,
    height: 1920,
    ratio: "9:16",
  },
  {
    id: "linkedin-feed",
    label: "LINKEDIN FEED",
    sublabel: "1200 × 627 px",
    width: 1200,
    height: 627,
    ratio: "1.91:1",
  },
];
