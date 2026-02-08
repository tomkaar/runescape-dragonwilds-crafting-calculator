import { CraftingTree } from "@/components/CraftingTree/CraftingTree";
import { GroupPanelSeparator } from "@/components/GroupPanelSeparator";
import { ItemInfoBox } from "@/components/Items/InfoBox";
import { RequiredMaterials } from "@/components/Items/RequiredMaterials";
import { UsedIn } from "@/components/Items/UsedIn";
import { SelectedMaterial } from "@/components/Items/SelectedMaterials/SelectedMaterials";
import { Item } from "@/Types";
import { type Layout } from "react-resizable-panels";
import { Attribution } from "@/components/Items/Attribution";
import { Suspense } from "react";
import { SelectedRecipes } from "@/components/Items/SelectedRecipes";
import { AllMaterials } from "@/components/Items/AllMaterials";
import { ContentContextProvider } from "@/components/panels/context";
import { PageLayout } from "@/components/panels/page-layout";
import { LeftSidebar } from "@/components/panels/left-sidebar";
import { RightSidebar } from "@/components/panels/right-sidebar";
import { Center } from "@/components/panels/center";

type Props = {
  itemPageLayout: Layout | undefined;
  itemPageSidebarLayout: Layout | undefined;
  itemPageSidebarRightLayout: Layout | undefined;
  item: Item;
  itemId: string;
};

export default function ContentDesktop(props: Props) {
  const {
    itemPageLayout,
    itemPageSidebarLayout,
    itemPageSidebarRightLayout,
    item,
    itemId,
  } = props;

  return (
    <ContentContextProvider>
      <PageLayout layout={itemPageLayout}>
        <LeftSidebar layout={itemPageSidebarLayout}>
          <ItemInfoBox item={item} itemId={itemId} />
          <RequiredMaterials itemId={itemId} variant="desktop" />
          <GroupPanelSeparator />
          <SelectedMaterial itemId={itemId} variant="desktop" />
          <GroupPanelSeparator />
          <UsedIn itemId={itemId} variant="desktop" />
          <GroupPanelSeparator />
          <Attribution variant="desktop" />
        </LeftSidebar>

        <GroupPanelSeparator horizontal />

        <Center>
          <Suspense>
            <div className="bg-neutral-900 w-full h-full">
              <CraftingTree itemId={itemId} />
            </div>
          </Suspense>
        </Center>

        <GroupPanelSeparator horizontal />

        <RightSidebar layout={itemPageSidebarRightLayout}>
          <AllMaterials itemId={itemId} variant="desktop" />
          <GroupPanelSeparator />
          <SelectedRecipes itemId={itemId} variant="desktop" />
        </RightSidebar>
      </PageLayout>
    </ContentContextProvider>
  );
}
