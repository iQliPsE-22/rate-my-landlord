"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  showValue = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const displayValue = hoverValue || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue;
        const halfFilled = !filled && star - 0.5 <= displayValue;

        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={`
              ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}
              transition-all duration-150 ease-out
              ${filled ? "text-amber-500" : "text-zinc-200"}
              ${halfFilled ? "text-amber-500/60" : ""}
            `}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
          >
            <Star
              className={`${sizeClasses[size]} transition-all duration-150`}
              fill={filled || halfFilled ? "currentColor" : "none"}
              strokeWidth={filled || halfFilled ? 0 : 2}
            />
          </button>
        );
      })}
      {showValue && value > 0 && (
        <span className="ml-1.5 text-sm font-semibold text-zinc-700 tabular-nums">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
