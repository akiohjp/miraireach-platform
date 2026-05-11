export default function HeroAmbientLayers() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -top-[35%] -left-[5%] h-[70%] w-[70%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle at 35% 35%, rgba(201,162,39,0.09), transparent 65%)" }}
      />
      <div
        className="absolute top-[15%] right-[0%] h-[55%] w-[55%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle at 65% 30%, rgba(238,220,154,0.14), transparent 60%)" }}
      />
      <div
        className="absolute bottom-[5%] left-[25%] h-[45%] w-[45%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle at 50% 70%, rgba(201,162,39,0.06), transparent 65%)" }}
      />
    </div>
  );
}
