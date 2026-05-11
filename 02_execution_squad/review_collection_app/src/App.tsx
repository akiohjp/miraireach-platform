import { useState } from "react";
import { APP_CONFIG, type Step } from "./config";
import { generateMockReview } from "./mockAI";
import StepRating from "./components/StepRating";
import StepKeywords from "./components/StepKeywords";
import StepGenerating from "./components/StepGenerating";
import StepResult from "./components/StepResult";
import StepFeedback from "./components/StepFeedback";
import StepFeedbackSent from "./components/StepFeedbackSent";

const POSITIVE_STEPS: Step[] = ["rating", "keywords", "generating", "result"];
const STEP_LABELS = ["Rating", "Keywords", "Generating", "Review"];

export default function App() {
  const [step, setStep] = useState<Step>("rating");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const progressIndex = POSITIVE_STEPS.indexOf(step);
  const isPositiveFlow = progressIndex >= 0;

  function handleRating(value: number) {
    setRating(value);
    setStep(value >= 4 ? "keywords" : "feedback");
  }

  async function handleKeywords(selected: string[]) {
    setStep("generating");
    const text = await generateMockReview(APP_CONFIG.storeName, selected);
    setReviewText(text);
    setStep("result");
  }

  function reset() {
    setStep("rating");
    setRating(0);
    setReviewText("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Top bar */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍣</span>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase opacity-75">
                Google Review
              </p>
              <p className="text-sm font-bold leading-tight">{APP_CONFIG.storeName}</p>
            </div>
          </div>
        </div>

        {/* Progress indicator (positive flow: steps 2–4) */}
        {isPositiveFlow && progressIndex > 0 && (
          <div className="px-6 pt-4 pb-1">
            <div className="flex items-center gap-1">
              {POSITIVE_STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-1 flex-1">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      i <= progressIndex ? "bg-amber-400" : "bg-gray-100"
                    }`}
                  />
                </div>
              ))}
            </div>
            <p className="text-right text-xs text-gray-300 mt-1">
              {STEP_LABELS[progressIndex]}
            </p>
          </div>
        )}

        {/* Step content */}
        <div className="p-6 pt-5">
          {step === "rating" && (
            <StepRating
              storeName={APP_CONFIG.storeName}
              greetingText={APP_CONFIG.greetingText}
              onSelect={handleRating}
            />
          )}
          {step === "keywords" && (
            <StepKeywords keywords={APP_CONFIG.keywords} onConfirm={handleKeywords} />
          )}
          {step === "generating" && <StepGenerating />}
          {step === "result" && (
            <StepResult
              reviewText={reviewText}
              gbpReviewUrl={APP_CONFIG.gbpReviewUrl}
              onRetry={reset}
            />
          )}
          {step === "feedback" && (
            <StepFeedback
              rating={rating}
              storeName={APP_CONFIG.storeName}
              onSubmit={() => setStep("feedback_sent")}
            />
          )}
          {step === "feedback_sent" && (
            <StepFeedbackSent storeName={APP_CONFIG.storeName} onReset={reset} />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 text-center">
          <p className="text-xs text-gray-200">Powered by AIO Company Core</p>
        </div>
      </div>
    </div>
  );
}
