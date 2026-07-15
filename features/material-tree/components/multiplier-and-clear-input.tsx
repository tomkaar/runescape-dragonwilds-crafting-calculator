import { Eraser } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
	const handleClearMarkedMaterials = () => {
		clearMarkedMaterials(itemId);
	};

	return (
		<div className="flex items-center gap-2 border-border py-2">
			<span className="block mr-8">Recipe multiplier</span>

			<MultiplierInput itemId={itemId} />

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="outline" size="icon">
						<Eraser className="w-4 h-4" />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Clear marked materials?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to clear all marked materials? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleClearMarkedMaterials}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
