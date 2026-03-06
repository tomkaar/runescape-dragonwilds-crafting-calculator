import { Button } from "@/components/ui/button";
import { useCraftingTreeDirection } from "@/store/crafting-tree-direction";
import { ArrowDownFromLineIcon, ArrowRightFromLine } from "lucide-react";

export function Direction() {
  const { direction, setDirection } = useCraftingTreeDirection();

  const handleChangeDirection = () => {
    setDirection(direction === "TB" ? "LR" : "TB");
  };

  return (
    <Button
      variant="secondary"
      className="cursor-pointer"
      onClick={handleChangeDirection}
    >
      {direction === "TB" ? <ArrowRightFromLine /> : <ArrowDownFromLineIcon />}
    </Button>
  );
}
