"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type AddressSelectorProps = {
  addresses: string[];
  onSelect: (address: string) => void;
  onAddNew: () => void;
};

export function AddressSelector({
  addresses,
  onSelect,
  onAddNew,
}: AddressSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? value : "Select an address..."}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search address..." />
          <CommandList>
            <CommandEmpty>No address found.</CommandEmpty>
            <CommandGroup>
              {addresses.map((address, index) => (
                <CommandItem
                  key={index}
                  value={address}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSelect(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === address ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {address}
                </CommandItem>
              ))}
              <CommandItem onSelect={onAddNew}>
                <span className="text-blue-500">+ Add new address</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
