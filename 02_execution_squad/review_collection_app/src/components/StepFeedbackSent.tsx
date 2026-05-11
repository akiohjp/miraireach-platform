type Props = {
  storeName: string;
  onReset: () => void;
};

export default function StepFeedbackSent({ storeName, onReset }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 text-center py-4">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl">
        ✅
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">Thank you!</h2>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">
          Your feedback has been received. The team at{" "}
          <span className="font-semibold text-gray-700">{storeName}</span> will
          review your comments and work hard to improve.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 w-full max-w-xs">
        <p className="text-xs text-amber-700 leading-relaxed">
          We hope to welcome you back and give you a better experience. 🍣
        </p>
      </div>

      <button
        onClick={onReset}
        className="text-xs text-gray-300 hover:text-gray-400 underline transition-colors"
      >
        ← Back to start
      </button>
    </div>
  );
}
