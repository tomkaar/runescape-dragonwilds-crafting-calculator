import { getItemByNameOrId } from "@/utils/getItemById";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { type Layout } from "react-resizable-panels";
import Content from "./Content";
import { type Metadata } from "next";

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

const LAYOUT_COOKIE_GROUP_ID = "item_layout";
const LAYOUT_SIDEBAR_COOKIE_GROUP_ID = "item_sidebar_layout";

export default async function ItemPage(props: Props) {
  const { itemId } = await props.params;
  const cookieStore = await cookies();

  const itemPageLayoutString = cookieStore.get(LAYOUT_COOKIE_GROUP_ID)?.value;
  const itemPageSidebarLayoutString = cookieStore.get(
    LAYOUT_SIDEBAR_COOKIE_GROUP_ID,
  )?.value;

  const itemPageLayout = itemPageLayoutString
    ? (JSON.parse(itemPageLayoutString) as Layout)
    : undefined;
  const itemPageSidebarLayout = itemPageSidebarLayoutString
    ? (JSON.parse(itemPageSidebarLayoutString) as Layout)
    : undefined;

  const item = getItemByNameOrId(itemId);

  if (item === undefined) {
    notFound();
  }

  return (
    <Content
      itemPageLayout={itemPageLayout}
      itemPageSidebarLayout={itemPageSidebarLayout}
      layoutCookieID={LAYOUT_COOKIE_GROUP_ID}
      sidebarLayoutCookieID={LAYOUT_SIDEBAR_COOKIE_GROUP_ID}
      item={item}
      itemId={itemId}
    />
  );
}
