import { Eraser } from "lucide-react";
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";
import { Button } from "@/components/ui/button";
import { useSelectedMaterial } from "@/store/selected-material";
import { MultiplierInput } from "./multiplier-input";

type Props = {
	itemId: string;
};

export function MultiplierAndClearInput(props: Props) {
	const { itemId } = props;

	const clearMarkedMaterials = useSelectedMaterial(
		(state) => state.clearMarkedMaterials,
	);

	return (
		<div className="flex items-center gap-2 border-border py-2">
			<span className="block mr-8">Recipe multiplier</span>

			<MultiplierInput itemId={itemId} />

			<ConfirmAlertDialog
				trigger={
					<Button variant="outline" size="icon">
						<Eraser className="w-4 h-4" />
					</Button>
				}
				title="Clear marked materials?"
				description="Are you sure you want to clear all marked materials? This action cannot be undone."
				onConfirm={() => clearMarkedMaterials(itemId)}
			/>
		</div>
	);
}
