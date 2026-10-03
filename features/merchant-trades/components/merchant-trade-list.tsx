import Link from "next/link";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import type { MerchantTradeGroup } from "../types/merchant-trades";

type Props = {
	groups: MerchantTradeGroup[];
	currency: { name: string; image: string | null };
};

export function MerchantTradeList({ groups, currency }: Props) {
	return (
		<div className="flex flex-col gap-3">
			{groups.map((group) => (
				<div key={group.merchant} className="flex flex-col gap-1">
					<h4 className="text-xs font-semibold text-muted-foreground">
						{group.merchant}
					</h4>
					<ul className="flex flex-col">
						{group.items.map((item) => (
							<li key={item.id}>
								<Link
									href={{ pathname: `/item/${item.id}` }}
									prefetch={false}
									className="text-sm pr-2 pl-2 py-1 flex flex-row gap-2 items-center hover:bg-accent hover:text-accent-foreground rounded-lg"
								>
									{item.image && (
										<img
											src={createImageUrlPath(item.image)}
											width={24}
											height={24}
											alt={item.name}
											data-icon="inline-start"
										/>
									)}
									{item.name}
									<span className="ml-auto flex flex-row gap-1 items-center tabular-nums">
										{item.cost}
										{currency.image ? (
											<img
												src={createImageUrlPath(currency.image, 32)}
												alt={currency.name}
												width={20}
												height={20}
												className="shrink-0"
											/>
										) : (
											` ${currency.name}`
										)}
									</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}
