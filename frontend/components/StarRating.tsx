import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  readonly?: boolean;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  value,
  readonly = false,
  onChange,
  size = "md",
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex gap-1.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`
            transition-all duration-200 focus:outline-none
            ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110 active:scale-95"}
          `}
        >
          <Star
            strokeWidth={1.5}
            className={`
              ${sizeMap[size]} transition-colors duration-200
              ${
                star <= value
                  ? "fill-[#1C1917] stroke-[#1C1917]" // active — black
                  : "fill-transparent stroke-[#D6D3D1]" // inactive — stone-300
              }
            `}
          />
        </button>
      ))}
    </div>
  );
}
