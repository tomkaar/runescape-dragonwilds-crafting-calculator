"use client";

import Image from "next/image";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useTodoCheckedItems } from "@/store/todo-checked-items";
import { cn } from "@/lib/utils";
import { getItemById } from "@/utils/itemById";

type CheckboxDescriptionProps = {
  id: string;
  quantity: number;
  defaultChecked: boolean;
};

export function CheckboxDescription(props: CheckboxDescriptionProps) {
  const { id, defaultChecked, quantity } = props;

  const toggleAnItem = useTodoCheckedItems((state) => state.toggleAnItem);
  const material = getItemById(id);

  if (!material) return null;

  const { name, image } = material;

  return (
    <div className="flex flex-row gap-2 items-center">
      <FieldGroup className="w-full">
        <Field
          orientation="horizontal"
          className="flex flex-row gap-2 items-center"
          style={{ alignItems: "center" }}
        >
          <Checkbox
            id={`checkbox-${name}`}
            name={`checkbox-${name}`}
            checked={defaultChecked}
            onCheckedChange={() => toggleAnItem(id)}
            className="group"
          />
          <FieldContent>
            <FieldLabel
              htmlFor={`checkbox-${name}`}
              className={cn(
                "flex flex-row gap-2 items-center",
                defaultChecked ? "opacity-50" : "",
              )}
            >
              {image && (
                <Image
                  src={createImageUrlPath(image)}
                  width={28}
                  height={28}
                  alt={name}
                />
              )}
              {quantity}x {name}
            </FieldLabel>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  );
}
