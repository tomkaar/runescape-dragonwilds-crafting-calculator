"use client";

import { Scale } from "lucide-react";
import {
  CollapsiblePanelDesktop,
  CollapsiblePanelMobile,
} from "@/components/ui/collapsible-panel";

type Props = {
  variant?: "desktop" | "mobile";
};

export function Attribution(props: Props) {
  const { variant = "desktop" } = props;

  const title = "Attribution";

  const content = (
    <div className="px-4">
      <p className="text-xs text-neutral-200">
        Data from the RuneScape: Dragonwilds Wiki
        <br />
        Content licensed under CC BY-NC-SA 3.0
        <br /> Not affiliated with Jagex Ltd., RuneScape: Dragonwilds Wiki or
        Weird Gloop
      </p>

      <p className="mt-2 text-xs text-neutral-200">
        Data on this page are based on wiki data and content on this page may
        not always be accurate or up-to-date. Please verify with official
        sources.
      </p>
    </div>
  );

  const PanelComponent =
    variant === "mobile" ? CollapsiblePanelMobile : CollapsiblePanelDesktop;

  return (
    <PanelComponent
      id="attribution"
      title={title}
      icon={Scale}
      defaultSize={52}
    >
      {content}
    </PanelComponent>
  );
}
