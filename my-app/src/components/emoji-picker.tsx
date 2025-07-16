"use client";

import { Smile } from "lucide-react";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import EmojiPickerComponent, { Theme } from "emoji-picker-react";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button">
          <Smile className="cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="mb-16 border-none bg-transparent shadow-none drop-shadow-none"
      >
        <EmojiPickerComponent
          theme={resolvedTheme as Theme}
          onEmojiClick={(emojiObject) => onChange(emojiObject.emoji)}
          height={350}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
