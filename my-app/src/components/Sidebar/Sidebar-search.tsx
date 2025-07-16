"use client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export const SearchSidebar = () => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(true);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "F" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={toggleOpen}
        className="w-full justify-start px-4 py-2 dark:bg- hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg"
      >
        <span className="text-gray-200 w-8">Search</span>
        <Search className="inline ml-2 " />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search conversation and Participants..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>Profile</CommandItem>
            <CommandItem>Billing</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
