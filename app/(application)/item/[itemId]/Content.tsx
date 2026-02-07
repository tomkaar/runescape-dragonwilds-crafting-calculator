"use client";

import { Item } from "@/Types";
import { type Layout } from "react-resizable-panels";
import ContentDesktop from "./ContentDesktop";
import ContentMobile from "./ContentMobile";

export default function Content({
  itemPageLayout,
  itemPageSidebarLayout,
  itemPageSidebarRightLayout,
  layoutCookieID,
  sidebarLayoutCookieID,
  sidebarRightLayoutCookieID,
  item,
  itemId,
}: {
  itemPageLayout: Layout | undefined;
  itemPageSidebarLayout: Layout | undefined;
  itemPageSidebarRightLayout: Layout | undefined;
  layoutCookieID: string;
  sidebarLayoutCookieID: string;
  sidebarRightLayoutCookieID: string;
  item: Item;
  itemId: string;
}) {
  return (
    <div className="h-full flex flex-col md:flex-row">
      <div className="block lg:hidden">
        <ContentMobile item={item} itemId={itemId} />
      </div>

      <div className="h-full w-full hidden lg:block">
        <ContentDesktop
          itemPageLayout={itemPageLayout}
          itemPageSidebarLayout={itemPageSidebarLayout}
          itemPageSidebarRightLayout={itemPageSidebarRightLayout}
          layoutCookieID={layoutCookieID}
          sidebarLayoutCookieID={sidebarLayoutCookieID}
          sidebarRightLayoutCookieID={sidebarRightLayoutCookieID}
          item={item}
          itemId={itemId}
        />
      </div>
    </div>
  );
}
