import React from "react";
import { Button } from "@/components/ui/button";

interface QuickReplyBarProps {
  options: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export const QuickReplyBar: React.FC<QuickReplyBarProps> = ({ options, onSelect, disabled }) => {
  if (!options.length) return null;
  return (
    <div className="flex flex-wrap gap-2 px-3 pb-2">
      {options.map((opt) => (
        <Button
          key={opt}
          type="button"
          variant="secondary"
          size="sm"
          className="rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/15"
          disabled={disabled}
          onClick={() => onSelect(opt)}
        >
          {opt}
        </Button>
      ))}
    </div>
  );
};
