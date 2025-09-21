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
  placeholder?: string;
  emptyText?: string;
  onSelect: (option: ComboboxOption) => void;
};

export function Combobox({
  options,
  placeholder = "Select option...",
  emptyText = "No option found.",
  onSelect,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Filter options based on input value
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

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
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder={`Search...`}
            className="h-9"
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <ScrollableList
              options={filteredOptions}
              value={value}
              onSelect={(option) => {
                onSelect(option);
                setOpen(false);
                setValue(option.value);
              }}
            />
          </CommandList>
        </Command>
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
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: 10,
    // count: options.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // px per row, adjust as needed
    overscan: 5,
  });

  return (
    <CommandGroup
      ref={parentRef}
      style={{
        maxHeight: "300px", // max height for scroll
        overflow: "auto",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer
          .getVirtualItems()
          .map((virtualRow: { index: number; size: number; start: number }) => {
            const option = options[virtualRow.index];
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
                  value={option.value}
                  onSelect={(currentValue) => {
                    onSelect(currentValue === value ? "" : currentValue);
                    onSelect(option);
                  }}
                  className="h-full w-full"
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              </div>
            );
          })}
      </div>
    </CommandGroup>
  );
}
