"use client";

import { Accordion } from "@/components/ui/accordion";
import { useAccordionState } from "@/store/accordion-state";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function AccordionPersisted({ className, children }: Props) {
  const { openItems, setOpenItems } = useAccordionState();

  return (
    <Accordion
      type="multiple"
      value={openItems}
      onValueChange={setOpenItems}
      className={className}
    >
      {children}
    </Accordion>
  );
}
