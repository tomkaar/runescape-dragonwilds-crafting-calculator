import { AnvilIcon } from "lucide-react";
import Link from "next/link";

export function NavBrand() {
	return (
		<Link href="/" prefetch={false}>
			<div className="flex flex-row gap-2 items-center">
				<div className="text-title border-2 border-title rounded-full p-1.5">
					<AnvilIcon size={20} />
				</div>
				<h1 className="text-base font-bold text-title whitespace-nowrap">
					RuneScape: Dragonwilds
					<br />{" "}
					<span className="block -mt-1 text-xs font-normal">
						Crafting calculator
					</span>
				</h1>
			</div>
		</Link>
	);
}
