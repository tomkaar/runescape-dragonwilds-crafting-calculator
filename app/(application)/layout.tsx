import type { ReactNode } from "react";
import { DesktopNavUtilities } from "@/features/navigation/components/desktop-nav-utilities";
import { MobileNavMenu } from "@/features/navigation/components/mobile-nav-menu";
import { NavBrand } from "@/features/navigation/components/nav-brand";
import { QuickNavActions } from "@/features/navigation/components/quick-nav-actions";

type Props = {
	children: ReactNode;
	modal: ReactNode;
};

export default function Layout(props: Props) {
	return (
		<div className="h-screen">
			<div className="sticky top-0 z-10 border-b bg-background border-border flex flex-col lg:flex-row gap-6 lg:items-center w-full p-4">
				<div className="flex flex-row items-center justify-between">
					<NavBrand />
					<MobileNavMenu />
				</div>
				<QuickNavActions />
				<DesktopNavUtilities />
			</div>

			<div className="lg:h-[calc(100vh-69px)]">{props.children}</div>
			{props.modal}
		</div>
	);
}
