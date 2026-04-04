import React from "react";

export const TypingIndicator: React.FC = () => (
  <div className="flex justify-start px-3 py-2">
    <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3 shadow-sm">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);
