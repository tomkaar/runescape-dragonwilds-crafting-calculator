"use client";

import { type ReactNode } from "react";
import { Panel } from "react-resizable-panels";

type Props = {
  children: ReactNode;
};

export function Center(props: Props) {
  const { children } = props;

  return (
    <Panel id="center" minSize={150}>
      {children}
    </Panel>
  );
}
