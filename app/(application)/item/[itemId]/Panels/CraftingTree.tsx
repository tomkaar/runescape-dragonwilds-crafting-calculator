import {
  CollapsiblePanelMobileButtonLayout,
  CollapsiblePanelMobileButtonTrigger,
  CollapsiblePanelMobileContent,
  CollapsiblePanelMobileRoot,
} from "@/components/CollapsiblePanel/mobile";
import { CraftingTreeTrigger } from "@/components/Items/CraftingTree/Trigger";
import { ItemCraftingTreeMobile } from "../components/CraftingTree";

type Props = {
  itemId: string;
};

export function CraftingTreeMobilePanel(props: Props) {
  const { itemId } = props;

  return (
    <CollapsiblePanelMobileRoot>
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
