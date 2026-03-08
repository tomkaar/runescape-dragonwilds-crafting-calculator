import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { HydrateStores } from "@/store/HydrateStores";
import { CraftingTreeHoverProvider } from "@/context/crafting-tree-hover";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased dark">
        <CraftingTreeHoverProvider>
          {children}
          <HydrateStores />
          <Analytics />
          <SpeedInsights />
        </CraftingTreeHoverProvider>
      </body>
    </html>
  );
}
