"use client";

import { Item } from "@/Types";
import { type Layout } from "react-resizable-panels";
import { useScreenWidth } from "@/hook/useScreenWidth";
import ContentDesktop from "./ContentDesktop";
import ContentMobile from "./ContentMobile";

export default function Content({
  itemPageLayout,
  itemPageSidebarLayout,
  layoutCookieID,
  sidebarLayoutCookieID,
  item,
  itemId,
}: {
  itemPageLayout: Layout | undefined;
  itemPageSidebarLayout: Layout | undefined;
  layoutCookieID: string;
  sidebarLayoutCookieID: string;
  item: Item;
  itemId: string;
}) {
  const isLargerThan768 = useScreenWidth(768);
  if (isLargerThan768) {
    return (
      <ContentDesktop
        itemPageLayout={itemPageLayout}
        itemPageSidebarLayout={itemPageSidebarLayout}
        layoutCookieID={layoutCookieID}
        sidebarLayoutCookieID={sidebarLayoutCookieID}
        item={item}
        itemId={itemId}
      />
    );
  }
  return <ContentMobile item={item} itemId={itemId} />;
}
