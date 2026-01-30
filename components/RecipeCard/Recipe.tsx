import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import Image from "next/image";

import { RecipeVariant } from "@/data/recipes";
import { useSelectedItems } from "@/store/selected-items";
import { useState } from "react";
import Facility from "./Facility";

type Props = {
  id: string;
  index: number;
  recipe: RecipeVariant;
  variantCounts: Record<string, number>;
};

export default function Recipe(props: Props) {
  const { recipe: r, id, variantCounts } = props;
  const value = variantCounts[r.id] || 0;

  const [isOpen, setIsOpen] = useState(false);

  const increaseItemCount = useSelectedItems(
    (state) => state.increaseItemCount,
  );
  const decreaseItemCount = useSelectedItems(
    (state) => state.decreaseItemCount,
  );
  const setCount = useSelectedItems((state) => state.setCount);

  return (
    <div key={r.id} className={`py-2 ${props.index !== 0 ? "border-t" : ""}`}>
      <div className="flex flex-row gap-2 items-center content-between">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="cursor-pointer grow flex flex-row gap-2 items-center justify-start text-left"
        >
          {isOpen ? <ChevronDown /> : <ChevronUp />}
          <h3>{r.name}</h3>
        </button>

        <InputGroup className="shrink w-24">
          <InputGroupAddon align="inline-start">
            <InputGroupButton
              onClick={() => decreaseItemCount(id, r.id)}
              size="icon-xs"
            >
              <Minus />
            </InputGroupButton>
          </InputGroupAddon>

          <InputGroupInput
            id="input-secure-19"
            className="text-center"
            value={value}
            onKeyDown={(e) => {
              console.log(e.key);
              switch (e.key) {
                case "ArrowUp":
                  return increaseItemCount(id, r.id);
                case "ArrowDown":
                  return decreaseItemCount(id, r.id);
              }
            }}
            onChange={(event) => setCount(id, r.id, Number(event.target.value))}
            min={0}
          />

          <InputGroupAddon align="inline-end">
            <InputGroupButton
              onClick={() => increaseItemCount(id, r.id)}
              size="icon-xs"
            >
              <Plus />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      {isOpen ? (
        <div className="flex flex-col gap-2">
          {r.facility ? (
            <div className="flex mt-2">
              <Facility facility={r.facility} />
            </div>
          ) : null}

          <ul className="pl-2 pt-2">
            {r.materials?.map((m, idx) => (
              <li key={idx} className="flex flex-row gap-2">
                <Image src={m.image} alt={m.name} width={30} height={30} />
                <span>
                  <span className="font-bold">
                    {m.quantity * (value || 1)}x
                  </span>{" "}
                  {m.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
