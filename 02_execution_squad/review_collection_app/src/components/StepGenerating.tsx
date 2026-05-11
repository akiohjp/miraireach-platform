export default function StepGenerating() {
  return (
    <div className="flex flex-col items-center gap-6 text-center py-8">
      {/* Spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          ✨
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">
          AI生成中
        </p>
        <h2 className="text-lg font-bold text-gray-900">
          レビュー文を作成しています
        </h2>
        <p className="mt-2 text-sm text-gray-400 leading-relaxed">
          選択されたキーワードをもとに<br />
          自然な口コミ文章を生成中です...
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
