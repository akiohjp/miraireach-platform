import { useState } from "react";

type Props = {
  storeName: string;
  greetingText: string;
  onSelect: (rating: number) => void;
};

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

export default function StepRating({ storeName, greetingText, onSelect }: Props) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  const active = hovered || selected;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-3xl shadow-md">
        🍣
      </div>

      <div className="space-y-1.5">
        <h1 className="text-lg font-bold text-gray-900">{storeName}</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{greetingText}</p>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest font-medium">
          How was your experience?
        </p>

        {/* Stars */}
        <div
          className="flex gap-1 sm:gap-2 justify-center touch-manipulation"
          onMouseLeave={() => setHovered(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onPointerDown={(e) => {
                if (e.pointerType === "mouse" && e.button !== 0) return;
                setSelected(star);
              }}
              onClick={() => setSelected(star)}
              onMouseEnter={() => setHovered(star)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl leading-none transition-all duration-100 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 select-none"
              aria-label={`${star} star`}
              aria-pressed={selected === star}
            >
              <span className={star <= active ? "opacity-100" : "opacity-20"}>⭐</span>
            </button>
          ))}
        </div>

        {/* Rating label */}
        <p className="mt-3 text-sm font-semibold text-amber-500 h-5 transition-all">
          {selected > 0 ? LABELS[selected] : ""}
        </p>
      </div>

      <button
        type="button"
        onClick={() => selected > 0 && onSelect(selected)}
        disabled={selected === 0}
        className="w-full max-w-xs py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all
          disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed
          bg-amber-400 text-white hover:bg-amber-500 active:scale-95 shadow-sm"
      >
        Continue →
      </button>
    </div>
  );
}
