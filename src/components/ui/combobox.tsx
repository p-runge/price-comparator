"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  options: ComboboxOption[];
  onSelect: (option: string) => void;
};

export function Combobox({ options, onSelect }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[250px] justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select a card"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <ScrollableList
          options={options}
          value={value}
          onSelect={(value) => {
            onSelect(value);
            setOpen(false);
            setValue(value);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function ScrollableList({
  options,
  value,
  onSelect,
}: {
  options: ComboboxOption[];
  value: string;
  onSelect: (option: string) => void;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const rowVirtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // px per row, adjust as needed
  });

  const [searchValue, setSearchValue] = useState("");

  // Filter options based on input value
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()),
  );
  // console.log("filteredOptions", filteredOptions);

  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder={`Search...`}
        className="h-9"
        value={searchValue}
        onValueChange={setSearchValue}
      />
      <CommandList>
        <CommandEmpty>No card found</CommandEmpty>
        <CommandGroup
          ref={parentRef}
          style={{
            maxHeight: "300px", // max height for scroll
            overflow: "auto",
          }}
        >
          <div
            style={{
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
            {rowVirtualizer
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              .getVirtualItems()
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              .map(
                (virtualRow: {
                  index: number;
                  size: number;
                  start: number;
                }) => {
                  const option = filteredOptions[virtualRow.index];
                  if (!option) return null;

                  return (
                    <div
                      key={option.value}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <CommandItem
                        // value={option.value}
                        onSelect={(currentValue) => {
                          onSelect(currentValue === value ? "" : currentValue);
                          onSelect(currentValue);
                        }}
                        className={cn(
                          "h-full w-full",
                          virtualRow.index % 2 === 0
                            ? "bg-muted"
                            : "bg-background",
                        )}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === option.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    </div>
                  );
                },
              )}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
