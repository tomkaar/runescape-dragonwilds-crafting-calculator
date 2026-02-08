import { Item } from "@/Types";
import { type Layout } from "react-resizable-panels";
import ContentDesktop from "./ContentDesktop";
import ContentMobile from "./ContentMobile";

type Props = {
  item: Item;
  itemId: string;
  itemPageLayout: Layout | undefined;
  itemPageSidebarLayout: Layout | undefined;
  itemPageSidebarRightLayout: Layout | undefined;
};

export default function Content(props: Props) {
  const {
    item,
    itemId,
    itemPageLayout,
    itemPageSidebarLayout,
    itemPageSidebarRightLayout,
  } = props;

  return (
    <div className="h-full flex flex-col">
      <div className="block lg:hidden">
        <ContentMobile item={item} itemId={itemId} />
      </div>

      <div className="h-full w-full hidden lg:block">
        <ContentDesktop
          item={item}
          itemId={itemId}
          itemPageLayout={itemPageLayout}
          itemPageSidebarLayout={itemPageSidebarLayout}
          itemPageSidebarRightLayout={itemPageSidebarRightLayout}
        />
      </div>
    </div>
  );
}
