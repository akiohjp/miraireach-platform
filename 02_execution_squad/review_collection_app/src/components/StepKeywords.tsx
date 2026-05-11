import { useState } from "react";

type Props = {
  keywords: readonly string[];
  onConfirm: (selected: string[]) => void;
};

export default function StepKeywords({ keywords, onConfirm }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(kw: string) {
    setSelected((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    );
  }

  const canProceed = selected.length > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">
          Step 2 — Keywords
        </p>
        <h2 className="text-base font-bold text-gray-900">
          What made your visit special?
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Select all that apply — we'll craft your review automatically.
        </p>
      </div>

      {/* Keyword grid */}
      <div className="flex flex-wrap gap-2 justify-center">
        {keywords.map((kw) => {
          const on = selected.includes(kw);
          return (
            <button
              key={kw}
              onClick={() => toggle(kw)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold border-2 transition-all duration-150 active:scale-95
                ${on
                  ? "bg-amber-400 border-amber-400 text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600"
                }`}
            >
              {on && <span className="mr-1">✓</span>}
              {kw}
            </button>
          );
        })}
      </div>

      {/* Counter */}
      <div className="flex items-center justify-center gap-2">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {selected.length > 0
            ? `${selected.length} keyword${selected.length > 1 ? "s" : ""} selected`
            : "No keywords selected yet"}
        </span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      {/* Selected preview chips */}
      {selected.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <p className="text-xs text-amber-600 font-medium mb-1.5">Your selection</p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {selected.map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-1 bg-amber-400 text-white text-xs rounded-full font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => canProceed && onConfirm(selected)}
        disabled={!canProceed}
        className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all
          disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed
          bg-amber-400 text-white hover:bg-amber-500 active:scale-95 shadow-sm"
      >
        Generate My Review ✨
      </button>
    </div>
  );
}
