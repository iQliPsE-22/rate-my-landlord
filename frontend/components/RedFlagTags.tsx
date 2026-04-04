"use client";

import { RED_FLAGS } from "@/types";
import type { RedFlagId } from "@/types";

interface RedFlagTagsProps {
  selected?: RedFlagId[];
  onChange?: (flags: RedFlagId[]) => void;
  readonly?: boolean;
  counts?: Record<string, number>;
}

export default function RedFlagTags({
  selected = [],
  onChange,
  readonly = false,
  counts,
}: RedFlagTagsProps) {
  const handleToggle = (id: RedFlagId) => {
    if (readonly || !onChange) return;
    if (selected.includes(id)) {
      onChange(selected.filter((f) => f !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const flagsToShow = readonly
    ? RED_FLAGS.filter((f) => selected.includes(f.id) || (counts && counts[f.id] > 0))
    : RED_FLAGS;

  if (flagsToShow.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {flagsToShow.map((flag) => {
        const isSelected = selected.includes(flag.id);
        const count = counts?.[flag.id];

        return (
          <button
            key={flag.id}
            type="button"
            disabled={readonly}
            onClick={() => handleToggle(flag.id)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200 border
              ${
                isSelected
                  ? "bg-red-500/15 border-red-500/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.1)]"
                  : readonly
                  ? "bg-slate-800/50 border-slate-700/50 text-slate-400"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 cursor-pointer"
              }
            `}
          >
            <span>{flag.emoji}</span>
            <span>{flag.label}</span>
            {count !== undefined && count > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
