import {
  CollapsiblePanelMobileButtonLayout,
  CollapsiblePanelMobileButtonTrigger,
  CollapsiblePanelMobileContent,
  CollapsiblePanelMobileRoot,
} from "@/components/CollapsiblePanel/mobile";
import { CraftingTreeTrigger } from "@/components/Items/CraftingTree/Trigger";
import { ItemCraftingTreeMobile } from "../components/CraftingTree";
import { ITEM_PANEL_CONFIGS } from "@/constants/item-panels";

type Props = {
  itemId: string;
};

export function CraftingTreeMobilePanel(props: Props) {
  const { itemId } = props;

  return (
    <CollapsiblePanelMobileRoot id={ITEM_PANEL_CONFIGS.craftingTree.id}>
      <CollapsiblePanelMobileButtonLayout>
        <CollapsiblePanelMobileButtonTrigger>
          <CraftingTreeTrigger />
        </CollapsiblePanelMobileButtonTrigger>
      </CollapsiblePanelMobileButtonLayout>
      <CollapsiblePanelMobileContent>
        <ItemCraftingTreeMobile itemId={itemId} className="h-65" />
      </CollapsiblePanelMobileContent>
    </CollapsiblePanelMobileRoot>
  );
}
