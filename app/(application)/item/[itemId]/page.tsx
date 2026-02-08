import { getItemByNameOrId } from "@/utils/getItemById";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { resolveServerPanelLayout } from "@/utils/resolve-server-panel-layout";
import {
  PANEL_LAYOUT_PAGE,
  PANEL_LAYOUT_SIDEBAR,
  PANEL_LAYOUT_SIDEBAR_RIGHT,
} from "@/constants/panel-layout";
import ContentMobile from "./ContentMobile";
import ContentDesktop from "./ContentDesktop";

type Props = {
  params: Promise<{ itemId: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { itemId } = await props.params;
  const item = getItemByNameOrId(itemId);

  return {
    title: [item?.name, "Dragonwilds Crafting Calculator"]
      .filter((s) => s !== null && s !== undefined)
      .join(" | "),
    description:
      "Calculate the materials needed to craft items in Runescape: Dragonwilds",
  };
}

export default async function ItemPage(props: Props) {
  const { itemId } = await props.params;

  const [pageLayout, pageSidebarLayout, pageSidebarRightLayout] =
    await Promise.all([
      resolveServerPanelLayout(PANEL_LAYOUT_PAGE),
      resolveServerPanelLayout(PANEL_LAYOUT_SIDEBAR),
      resolveServerPanelLayout(PANEL_LAYOUT_SIDEBAR_RIGHT),
    ]);

  const item = getItemByNameOrId(itemId);

  if (item === undefined) {
    notFound();
  }

  return (
    <div className="h-full flex flex-col">
      <div className="block lg:hidden">
        <ContentMobile item={item} itemId={itemId} />
      </div>

      <div className="h-full w-full hidden lg:block">
        <ContentDesktop
          item={item}
          itemId={itemId}
          itemPageLayout={pageLayout}
          itemPageSidebarLayout={pageSidebarLayout}
          itemPageSidebarRightLayout={pageSidebarRightLayout}
        />
      </div>
    </div>
  );
}
