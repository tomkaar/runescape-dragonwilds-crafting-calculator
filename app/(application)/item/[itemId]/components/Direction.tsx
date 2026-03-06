import { Button } from "@/components/ui/button";
import { useCraftingTreeDirection } from "@/store/crafting-tree-direction";
import { ArrowDownFromLineIcon, ArrowRightFromLine } from "lucide-react";

export function Direction() {
  const { direction, setDirection } = useCraftingTreeDirection();
  const isTopToBottom = direction === "TB";

  const handleChangeDirection = () => {
    setDirection(isTopToBottom ? "LR" : "TB");
  };

  return (
    <Button
      type="button"
      variant="secondary"
      className="cursor-pointer"
      onClick={handleChangeDirection}
      aria-pressed={!isTopToBottom}
      aria-label={
        isTopToBottom
          ? "Switch crafting tree direction to left-to-right"
          : "Switch crafting tree direction to top-to-bottom"
      }
    >
      {isTopToBottom ? (
        <ArrowRightFromLine aria-hidden="true" />
      ) : (
        <ArrowDownFromLineIcon aria-hidden="true" />
      )}
    </Button>
  );
}
