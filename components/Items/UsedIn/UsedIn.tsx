import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import Link from "@/components/link";
import { getUsedIn } from "@/utils/getUsedIn";

export function AccordionUsedIn({ itemId }: { itemId: string }) {
  const usedIn = getUsedIn(itemId);

  return (
    <AccordionItem
      value="used-in"
      className="bg-background rounded-lg border border-accent"
    >
      <AccordionTrigger className="cursor-pointer text-foreground px-4">
        <div className="flex flex-col">
          Used in
          <span className="text-xs text-muted-foreground">
            See what items this material is used to craft.
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-2 py-4 text-foreground">
        <ul className="flex flex-col flex-wrap">
          {usedIn.length === 0 && (
            <li className="text-sm text-muted-foreground">
              Not used in any recipes
            </li>
          )}
          {usedIn
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) => (
              <li key={item.id}>
                <Link
                  href={{ pathname: `/item/${item.id}` }}
                  className="text-sm pr-2 pl-2 py-1 flex flex-row gap-2 items-center hover:bg-accent hover:text-accent-foreground rounded-lg"
                >
                  {item.image && (
                    <img
                      src={createImageUrlPath(item.image)}
                      width={24}
                      height={24}
                      alt={item.name}
                      data-icon="inline-start"
                    />
                  )}
                  {item.name}
                </Link>
              </li>
            ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
