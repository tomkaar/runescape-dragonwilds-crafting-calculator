"use client";

import { Eraser } from "lucide-react";
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";
import { Button } from "@/components/ui/button";
import { useSelectedMaterial } from "@/store/selected-material";

type Props = {
	itemId: string;
};

export function ClearSelected(props: Props) {
	const { itemId } = props;

	const clearMarkedMaterials = useSelectedMaterial(
		(state) => state.clearMarkedMaterials,
	);

	return (
		<ConfirmAlertDialog
			trigger={
				<Button
					type="button"
					variant="secondary"
					aria-label="Clear selected materials"
				>
					<Eraser aria-hidden="true" />
				</Button>
			}
			title="Clear marked materials?"
			description="Are you sure you want to clear all marked materials? This action cannot be undone."
			onConfirm={() => clearMarkedMaterials(itemId)}
		/>
	);
}
