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
  onSelect: (option: ComboboxOption) => void;
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
          onSelect={(option) => {
            onSelect(option);
            setOpen(false);
            setValue(option.value);
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
  onSelect: (option: ComboboxOption) => void;
}) {
  const [searchValue, setSearchValue] = useState("");
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const parentRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const rowVirtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // px per row
  });

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
        <CommandGroup ref={parentRef} className="max-h-[300px] overflow-auto">
          <div
            className="relative"
            style={{
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              height: `${rowVirtualizer.getTotalSize()}px`,
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
                      className="absolute top-0 left-0 w-full"
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <CommandItem
                        onSelect={(currentValue) => {
                          const option = filteredOptions.find(
                            (opt) => opt.label === currentValue,
                          );
                          if (!option) return;

                          onSelect(option);
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
