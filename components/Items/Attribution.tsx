"use client";

import { Scale } from "lucide-react";
import { Panel, usePanelRef } from "react-resizable-panels";
import { useRef } from "react";

export function Attribution() {
  const panelRef = usePanelRef();
  const contentRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
    if (panelRef.current) {
      if (panelRef.current.isCollapsed()) {
        panelRef.current.expand();
        const contentHeight = contentRef.current?.offsetHeight;
        panelRef.current.expand();
        panelRef.current.resize(
          contentHeight ? contentHeight + 52 + 20 : "50%",
        );
      } else {
        panelRef.current.collapse();
      }
    }
  };

  return (
    <Panel
      id="attribution"
      panelRef={panelRef}
      minSize={52}
      collapsible
      defaultSize={52}
      collapsedSize={52}
      className="bg-neutral-950 rounded-lg"
    >
      <button
        onClick={togglePanel}
        className="cursor-pointer w-full flex flex-row items-center gap-2 px-4 py-4 text-sm"
      >
        <Scale className="w-4 h-4 text-neutral-600 fill-neutral-600" />
        Attribution
      </button>
      <div className="px-4 pt-2 overflow-scroll h-full pb-15">
        <div ref={contentRef}>
          <p className="text-xs text-neutral-200">
            Data from the RuneScape: Dragonwilds Wiki
            <br />
            Content licensed under CC BY-NC-SA 3.0
            <br /> Not affiliated with Jagex Ltd., RuneScape: Dragonwilds Wiki
            or Weird Gloop
          </p>

          <p className="mt-2 text-xs text-neutral-200">
            Data on this page are based on wiki data and content on this page
            may not always be accurate or up-to-date. Please verify with
            official sources.
          </p>
        </div>
      </div>
    </Panel>
  );
}
