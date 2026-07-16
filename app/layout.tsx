import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { CraftingTreeHoverProvider } from "@/features/crafting-tree/context/crafting-tree-hover";
import { HydrateStores } from "@/store/HydrateStores";

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
