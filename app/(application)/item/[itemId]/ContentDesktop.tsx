import { GroupPanelSeparator } from "@/components/GroupPanelSeparator";
import { ItemInfoBox } from "@/components/Items/InfoBox";
import { Item } from "@/Types";
import { Suspense } from "react";
import { ContentContextProvider } from "@/components/panels/context";
import { PageLayout } from "@/components/panels/page-layout";
import { LeftSidebar } from "@/components/panels/left-sidebar";
import { RightSidebar } from "@/components/panels/right-sidebar";
import { Center } from "@/components/panels/center";
import { RequiredMaterialsDesktopPanel } from "./Panels/RequiredMaterials";
import { SelectedMaterialDesktopPanel } from "./Panels/SelectedMaterial";
import { UsedInDesktopPanel } from "./Panels/UsedIn";
import { AllMaterialsDesktopPanel } from "./Panels/AllMaterials";
import { AllRecipesDesktopPanel } from "./Panels/AllRecipes";
import { ItemCraftingTreeDesktop } from "./components/CraftingTree";

type Props = {
  item: Item;
  itemId: string;
};

export default function ContentDesktop(props: Props) {
  const { item, itemId } = props;

  return (
    <ContentContextProvider>
      <PageLayout>
        <LeftSidebar>
          <ItemInfoBox item={item} itemId={itemId} />

          <RequiredMaterialsDesktopPanel itemId={itemId} />
          <GroupPanelSeparator />
          <SelectedMaterialDesktopPanel itemId={itemId} />
          <GroupPanelSeparator />
          <UsedInDesktopPanel itemId={itemId} />
        </LeftSidebar>

        <GroupPanelSeparator horizontal />

        <Center>
          <Suspense>
            <div className="bg-card w-full h-full">
              <ItemCraftingTreeDesktop itemId={itemId} />
            </div>
          </Suspense>
        </Center>

        <GroupPanelSeparator horizontal />

        <RightSidebar>
          <AllMaterialsDesktopPanel />
          <GroupPanelSeparator />
          <AllRecipesDesktopPanel />
        </RightSidebar>
      </PageLayout>
    </ContentContextProvider>
  );
}
