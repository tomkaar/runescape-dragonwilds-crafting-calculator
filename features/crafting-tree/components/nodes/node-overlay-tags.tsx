import { ExcessItemsTooltip } from "@/features/crafting-tree/components/nodes/excess-items-tooltip";
import { RecipeNumberTooltip } from "@/features/crafting-tree/components/nodes/recipe-number-tooltip";

type Props = {
	isRecipeNumberVariant: number | null;
	hasExcessItems: boolean;
	quantity: number;
	quantityRecieved: number;
};

export function NodeOverlayTags(props: Props) {
	const { isRecipeNumberVariant, hasExcessItems, quantity, quantityRecieved } =
		props;

	if (isRecipeNumberVariant === null && !hasExcessItems) return null;

	return (
		<div className="absolute z-10 flex flex-row gap-1 -top-3 left-1/2 -translate-x-1/2">
			{isRecipeNumberVariant !== null && (
				<RecipeNumberTooltip isRecipeNumberVariant={isRecipeNumberVariant} />
			)}
			{hasExcessItems && (
				<ExcessItemsTooltip
					quantityRecieved={quantityRecieved}
					quantity={quantity}
				/>
			)}
		</div>
	);
}
