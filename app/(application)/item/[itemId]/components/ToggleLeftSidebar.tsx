import { useContentContext } from "@/components/panels/context";
import { Button } from "@/components/ui/button";
import { Panel } from "@xyflow/react";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

export function ToggleLeftSidebar() {
  const { sidebarIsCollapsed, toggleSidebar } = useContentContext();

  return (
    <Panel position="top-left">
      <Button onClick={toggleSidebar} variant="secondary">
        {sidebarIsCollapsed ? (
          <PanelLeftOpenIcon className="w-2 h-2" />
        ) : (
          <PanelLeftCloseIcon className="w-2 h-2" />
        )}
      </Button>
    </Panel>
  );
}
