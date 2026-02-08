import { getItemByNameOrId } from "@/utils/getItemById";
import { notFound } from "next/navigation";
import Content from "./Content";
import { type Metadata } from "next";
import { resolveServerPanelLayout } from "@/utils/resolve-server-panel-layout";
import {
  PANEL_LAYOUT_PAGE,
  PANEL_LAYOUT_SIDEBAR,
  PANEL_LAYOUT_SIDEBAR_RIGHT,
} from "@/constants/panel-layout";

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
    <Content
      item={item}
      itemId={itemId}
      itemPageLayout={pageLayout}
      itemPageSidebarLayout={pageSidebarLayout}
      itemPageSidebarRightLayout={pageSidebarRightLayout}
    />
  );
}
