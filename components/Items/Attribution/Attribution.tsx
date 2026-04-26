import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AccordionAttribution() {
  return (
    <AccordionItem
      value="attribution"
      className="bg-background rounded-lg border border-accent"
    >
      <AccordionTrigger className="text-foreground px-4">
        <div className="flex flex-col">Attribution</div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 text-foreground">
        <span className="text-xs text-foreground">
          <span className="block mt-2">
            Data from the RuneScape: Dragonwilds Wiki
          </span>

          <span className="block mt-2">
            Content licensed under CC BY-NC-SA 3.0
          </span>

          <span className="block mt-2">
            Not affiliated with Jagex Ltd., RuneScape: Dragonwilds Wiki or Weird
            Gloop
          </span>

          <span className="block mt-2">
            Data on this page are based on wiki data and content on this page
            may not always be accurate or up-to-date. Please verify with
            official sources.
          </span>
        </span>
      </AccordionContent>
    </AccordionItem>
  );
}
