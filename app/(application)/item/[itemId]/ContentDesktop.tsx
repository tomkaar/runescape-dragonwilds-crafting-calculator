import { GroupPanelSeparator } from "@/components/GroupPanelSeparator";
import { ItemInfoBox } from "@/components/Items/InfoBox";
import { Item } from "@/Types";
import { Suspense } from "react";
import { ContentContextProvider } from "@/components/panels/context";
import { PageLayout } from "@/components/panels/page-layout";
import { LeftSidebar } from "@/components/panels/left-sidebar";
import { RightSidebar } from "@/components/panels/right-sidebar";
import { Center } from "@/components/panels/center";
import { resolveServerPanelLayout } from "@/utils/resolve-server-panel-layout";
import {
  PANEL_LAYOUT_PAGE,
  PANEL_LAYOUT_SIDEBAR,
  PANEL_LAYOUT_SIDEBAR_RIGHT,
} from "@/constants/panel-layout";
import { RequiredMaterialsDesktopPanel } from "./Panels/RequiredMaterials";
import { SelectedMaterialDesktopPanel } from "./Panels/SelectedMaterial";
import { UsedInDesktopPanel } from "./Panels/UsedIn";
import { AttributionDesktopPanel } from "./Panels/Attribution";
import { AllMaterialsDesktopPanel } from "./Panels/AllMaterials";
import { AllRecipesDesktopPanel } from "./Panels/AllRecipes";
import { ItemCraftingTreeDesktop } from "./components/CraftingTree";

type Props = {
  item: Item;
  itemId: string;
};

export default async function ContentDesktop(props: Props) {
  const { item, itemId } = props;

  const [pageLayout, pageSidebarLayout, pageSidebarRightLayout] =
    await Promise.all([
      resolveServerPanelLayout(PANEL_LAYOUT_PAGE),
      resolveServerPanelLayout(PANEL_LAYOUT_SIDEBAR),
      resolveServerPanelLayout(PANEL_LAYOUT_SIDEBAR_RIGHT),
    ]);

  return (
    <ContentContextProvider>
      <PageLayout layout={pageLayout}>
        <LeftSidebar layout={pageSidebarLayout}>
          <ItemInfoBox item={item} itemId={itemId} />

          <RequiredMaterialsDesktopPanel itemId={itemId} />
          <GroupPanelSeparator />
          <SelectedMaterialDesktopPanel itemId={itemId} />
          <GroupPanelSeparator />
          <UsedInDesktopPanel itemId={itemId} />
          <GroupPanelSeparator />
          <AttributionDesktopPanel />
        </LeftSidebar>

        <GroupPanelSeparator horizontal />

        <Center>
          <Suspense>
            <div className="bg-neutral-900 w-full h-full">
              <ItemCraftingTreeDesktop itemId={itemId} />
            </div>
          </Suspense>
        </Center>

        <GroupPanelSeparator horizontal />

        <RightSidebar layout={pageSidebarRightLayout}>
          <AllMaterialsDesktopPanel />
          <GroupPanelSeparator />
          <AllRecipesDesktopPanel />
        </RightSidebar>
      </PageLayout>
    </ContentContextProvider>
  );
}
