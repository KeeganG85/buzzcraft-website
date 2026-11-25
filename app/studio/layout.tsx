import type { Metadata } from "next";
import { studioRobots } from "@/lib/studio";

export const metadata: Metadata = {
  robots: studioRobots,
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
