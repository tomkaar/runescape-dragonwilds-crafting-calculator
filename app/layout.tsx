import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SearchAndNavigationProvider } from "@/features/command/context/search-and-navigation";
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
				<SearchAndNavigationProvider>
					<CraftingTreeHoverProvider>
						{children}
						<HydrateStores />
						<Analytics />
						<SpeedInsights />
					</CraftingTreeHoverProvider>
				</SearchAndNavigationProvider>
			</body>
		</html>
	);
}
