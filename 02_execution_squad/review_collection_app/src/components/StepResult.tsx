import { useState } from "react";

type Props = {
  reviewText: string;
  gbpReviewUrl: string;
  onRetry: () => void;
};

function buildTranslateUrl(text: string): string {
  // Sends English review to Google Translate (EN → JA by default)
  // Users can switch target language on Google Translate freely.
  return `https://translate.google.com/?sl=en&tl=ja&text=${encodeURIComponent(text)}&op=translate`;
}

export default function StepResult({ reviewText, gbpReviewUrl, onRetry }: Props) {
  const [text, setText] = useState(reviewText);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handlePostToGoogle() {
    navigator.clipboard.writeText(text);
    window.open(gbpReviewUrl, "_blank");
  }

  function handleTranslate() {
    window.open(buildTranslateUrl(text), "_blank");
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">
          Step 4 — Your Review
        </p>
        <h2 className="text-base font-bold text-gray-900">
          Your review is ready! 🎉
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Feel free to edit before posting.
        </p>
      </div>

      {/* Review textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full p-4 text-sm text-gray-800 leading-relaxed border-2 border-amber-200
            rounded-xl resize-none focus:outline-none focus:border-amber-400 transition-colors
            bg-amber-50 font-normal"
        />
        <span className="absolute bottom-3 right-3 text-xs text-gray-300">
          {text.length} chars
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2.5">

        {/* Copy */}
        <button
          onClick={handleCopy}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 border-2
            ${copied
              ? "border-green-400 bg-green-50 text-green-600"
              : "border-amber-300 bg-white text-amber-600 hover:bg-amber-50"
            }`}
        >
          {copied ? "✓  Copied to clipboard!" : "📋  Copy review text"}
        </button>

        {/* Google Translate */}
        <button
          onClick={handleTranslate}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95
            bg-blue-500 text-white hover:bg-blue-600 shadow-sm flex items-center justify-center gap-2"
        >
          <span>🌐</span>
          <span>View in Google Translate</span>
        </button>

        {/* Post to Google */}
        <button
          onClick={handlePostToGoogle}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95
            bg-amber-400 text-white hover:bg-amber-500 shadow-sm"
        >
          ⭐ Post on Google Maps
        </button>
      </div>

      {/* How-to note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-left">
        <p className="text-xs text-blue-600 font-bold mb-1.5">📌 How to post</p>
        <ol className="text-xs text-blue-500 space-y-1 list-decimal list-inside leading-relaxed">
          <li>Tap <strong>"Copy review text"</strong></li>
          <li>Tap <strong>"Post on Google Maps"</strong></li>
          <li>Paste your review and tap <strong>Post</strong></li>
        </ol>
        <p className="text-xs text-blue-400 mt-2">
          💡 Use <strong>"Google Translate"</strong> to check the review in another language first.
        </p>
      </div>

      <button
        onClick={onRetry}
        className="text-xs text-gray-300 hover:text-gray-400 underline text-center transition-colors"
      >
        ← Start over
      </button>
    </div>
  );
}
