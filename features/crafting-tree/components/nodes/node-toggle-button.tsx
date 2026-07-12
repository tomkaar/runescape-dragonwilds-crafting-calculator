"use client";

import { cn } from "@/lib/utils";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { useSelectedMaterial } from "@/store/selected-material";

type Props = {
  id: string;
  nodeId: string;
  initialItemId: string;
  image: string | null;
  label: string;
  quantity: number;
  disabled?: boolean;
};

export function NodeToggleButton(props: Props) {
  const { id, nodeId, initialItemId, image, label, quantity, disabled } = props;

  const i = useSelectedMaterial((state) => state.items);
  const items = i[initialItemId] || [];
  const added = items.find((item) => item.nodeId === nodeId);
  const addAnItem = useSelectedMaterial((state) => state.addAnItem);
  const removeAnItemByNodeId = useSelectedMaterial(
    (state) => state.removeAnItemByNodeId,
  );

  const handleToggleItem = () => {
    if (added) {
      removeAnItemByNodeId(initialItemId, nodeId);
      return;
    }
    addAnItem(initialItemId, {
      id: self.crypto.randomUUID(),
      itemId: id,
      quantity,
      nodeId,
      nodeOriginalId: initialItemId,
      state: "TODO",
    });
  };

  return (
    <button
      onClick={handleToggleItem}
      className={cn(
        "flex flex-row gap-1 items-center pl-1 py-1",
        disabled && "pr-2",
      )}
      disabled={disabled}
    >
      {image && (
        <img
          src={createImageUrlPath(image)}
          alt={label}
          width={24}
          height={24}
        />
      )}
      <div className="text-xs text-foreground">
        <span className="font-semibold">{quantity}x</span> {label}
      </div>
    </button>
  );
}
