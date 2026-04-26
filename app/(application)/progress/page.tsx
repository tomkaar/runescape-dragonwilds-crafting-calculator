import { type Metadata } from "next";

import { ProgressPage } from "@/components/Progress/ProgressPage";

export const metadata: Metadata = {
  title: "Progress | Dragonwilds Crafting Calculator",
  description:
    "Track your crafting progress in RuneScape: Dragonwilds. See what materials you still need to gather and craft.",
};

export default function Page() {
  return (
    <main className="h-full">
      <ProgressPage />
    </main>
  );
}
