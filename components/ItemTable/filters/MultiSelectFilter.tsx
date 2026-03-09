"use client";

import { ReactNode, useMemo, useState } from "react";
import { matchSorter } from "match-sorter";
import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChips,
  ComboboxValue,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
} from "@/components/ui/combobox";

type Option = {
  label: string;
  value: string;
  icon?: ReactNode;
};

type Props = {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export function MultiSelectFilter({
  options,
  selected,
  onChange,
  placeholder,
}: Props) {
  const [query, setQuery] = useState("");
  const anchor = useComboboxAnchor();

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    return matchSorter(options, query, { keys: ["label"] });
  }, [query, options]);

  return (
    <div className="flex flex-col gap-1">
      <Combobox
        multiple
        items={options}
        filteredItems={filteredOptions}
        inputValue={query}
        onInputValueChange={setQuery}
        value={options.filter((o) => selected.includes(o.value))}
        onValueChange={(values: Option[], evt) => {
          evt.event.stopPropagation();
          onChange(values.map((v) => v.value));
        }}
        itemToStringValue={(item: Option) => item.label}
      >
        <ComboboxChips ref={anchor} className="w-full max-w-xs">
          <ComboboxValue>
            {(values: Option[]) => (
              <>
                {values.map(({ value, label, icon }) => (
                  <ComboboxChip key={value}>
                    {icon}
                    {label}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput
                  placeholder={placeholder}
                  className="text-base"
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxEmpty>No options found.</ComboboxEmpty>

          <ComboboxList>
            {filteredOptions.map((option) => (
              <ComboboxItem
                key={option.value}
                value={option}
                className="text-base"
              >
                {option.icon && <span className="shrink-0">{option.icon}</span>}
                {option.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
