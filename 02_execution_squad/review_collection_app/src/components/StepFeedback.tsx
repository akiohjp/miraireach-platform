import { useState } from "react";

type Props = {
  rating: number;
  storeName: string;
  onSubmit: () => void;
};

const QUICK_TAGS = ["Food quality", "Service", "Wait time", "Pricing", "Cleanliness", "Other"];

export default function StepFeedback({ rating, storeName, onSubmit }: Props) {
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
        🙏
      </div>

      <div>
        <p className="text-xs text-gray-300 mb-1">
          {"⭐".repeat(rating)}{"☆".repeat(5 - rating)}
        </p>
        <h2 className="text-base font-bold text-gray-900">
          We're sorry to hear that.
        </h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs">
          Your feedback helps {storeName} improve. Please tell us what happened so we can make it right.
        </p>
      </div>

      {/* Quick tags */}
      <div className="flex flex-wrap justify-center gap-2">
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setText((p) => p ? `${p}, ${tag}` : tag)}
            className="px-3 py-1.5 rounded-full text-xs border border-gray-200 text-gray-500
              hover:border-gray-400 hover:text-gray-700 transition-colors bg-white active:scale-95"
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="w-full max-w-xs">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Please describe your experience..."
          rows={5}
          className="w-full p-3.5 text-sm text-gray-800 leading-relaxed border-2 border-gray-200
            rounded-xl resize-none focus:outline-none focus:border-gray-400 transition-colors bg-white"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={text.trim().length === 0}
        className="w-full max-w-xs py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all
          disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed
          bg-gray-800 text-white hover:bg-gray-700 active:scale-95 shadow-sm"
      >
        Send Feedback
      </button>
    </div>
  );
}
