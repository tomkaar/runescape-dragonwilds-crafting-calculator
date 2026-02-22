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

type Props = {
  itemId: string;
};

export function ClearSelected(props: Props) {
  const { itemId } = props;

  const clearMarkedMaterials = useSelectedMaterial(
    (state) => state.clearMarkedMaterials,
  );
  const handleClearMarkedMaterials = () => {
    clearMarkedMaterials(itemId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="cursor-pointer">
          Clear
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
  );
}
