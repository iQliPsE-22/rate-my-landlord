import { RED_FLAGS } from "@/types";
import type { RedFlagId } from "@/types";

interface RedFlagTagsProps {
  selected: RedFlagId[];
  onChange: (selected: RedFlagId[]) => void;
}

export default function RedFlagTags({ selected, onChange }: RedFlagTagsProps) {
  const toggle = (id: RedFlagId) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {RED_FLAGS.map((flag) => {
        const isSelected = selected.includes(flag.id);
        return (
          <button
            key={flag.id}
            type="button"
            onClick={() => toggle(flag.id)}
            className={`
              px-4 py-3 rounded-sm text-sm font-bold border transition-all duration-200 text-left flex items-center gap-3
              ${isSelected 
                ? "bg-red-50 border-red-600 text-red-700 shadow-[2px_2px_0px_rgba(220,38,38,1)]" 
                : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
              }
            `}
          >
            <span className="text-xl">{flag.emoji}</span>
            <span>{flag.label}</span>
          </button>
        );
      })}
    </div>
  );
}
