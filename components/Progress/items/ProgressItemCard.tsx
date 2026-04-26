"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, RotateCcw, Trash2 } from "lucide-react";

import { type Item } from "@/Types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { RequiredMaterialsContent } from "@/components/Items/Materials/components/Tree";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useSelectedMaterial } from "@/store/selected-material";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

type Props = {
  itemId: string;
  item: Item;
};

export function ProgressItemCard({ itemId, item }: Props) {
  const materials = useSelectedMaterial((state) => state.items[itemId] ?? []);
  const resetAllToTodo = useSelectedMaterial((state) => state.resetAllToTodo);
  const clearMarkedMaterials = useSelectedMaterial(
    (state) => state.clearMarkedMaterials,
  );

  const multipliers = useMaterialMultiplier((state) => state.items);
  const setMultiplier = useMaterialMultiplier((state) => state.setMultiplier);
  const multiplier = multipliers[itemId] || 1;

  const [inputValue, setInputValue] = useState(String(multiplier));

  // Sync local input state when the store value changes externally (e.g. on hydration).
  useEffect(() => {
    setInputValue(String(multiplier));
  }, [multiplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 1000) {
      setMultiplier(itemId, parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed < 1) setInputValue(String(multiplier));
  };

  return (
    <AccordionItem
      value={`progress-${itemId}`}
      className="bg-background rounded-lg border border-accent"
    >
      <AccordionTrigger className="text-foreground px-4">
        <div className="flex flex-row items-center gap-3">
          {item.image && (
            <img
              src={createImageUrlPath(item.image)}
              alt={item.name}
              width={24}
              height={24}
              className="shrink-0"
            />
          )}
          <div className="flex flex-col text-left">
            <span>{item.name}</span>
            <span className="text-xs text-muted-foreground font-normal">
              Multiplier: {multiplier}x
            </span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 text-foreground flex flex-col gap-4 pt-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="cursor-pointer" asChild>
            <Link href={`/item/${itemId}`}>
              <span className="hidden md:inline lg:hidden xl:inline">Item</span>
              <ChevronRight className="size-4" />
            </Link>
          </Button>
          <InputGroup className="w-24">
            <InputGroupInput
              type="number"
              autoComplete="off"
              placeholder="Multiplier"
              value={inputValue}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <InputGroupAddon align="inline-end">×</InputGroupAddon>
          </InputGroup>
          <Button
            variant="outline"
            size="sm"
            disabled={materials.length === 0}
            className="ml-auto"
            onClick={() => resetAllToTodo(itemId)}
          >
            <RotateCcw className="size-4" />
            <span className="hidden md:inline lg:hidden xl:inline">
              Reset to Todo
            </span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
                <span className="hidden md:inline lg:hidden xl:inline">
                  Remove
                </span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Remove {item.name} from progress?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all tracked materials for {item.name}. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => clearMarkedMaterials(itemId)}>
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <RequiredMaterialsContent itemId={itemId} skipFirstLayer />
      </AccordionContent>
    </AccordionItem>
  );
}
