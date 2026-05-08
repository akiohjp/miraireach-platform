/** Shared markup for programmatic OG / Twitter images (matches header typography). */
export function OgBrandMarkup() {
  return (
    <div
      style={{
        background: "linear-gradient(155deg, #ffffff 0%, #f7f5f0 45%, #ede8df 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          gap: 14,
          marginBottom: 32,
        }}
      >
        <span style={{ fontSize: 108, fontWeight: 900, color: "#1a1714", letterSpacing: -3 }}>GAM</span>
        <span style={{ fontSize: 108, fontWeight: 700, color: "#D4AF37", letterSpacing: -2 }}>solutions</span>
      </div>
      <p
        style={{
          margin: 0,
          padding: "0 48px",
          fontSize: 30,
          fontWeight: 600,
          color: "rgba(26,23,20,0.58)",
          textAlign: "center",
          maxWidth: 960,
          lineHeight: 1.4,
        }}
      >
        Dubai & UAE AI marketing · GEO · Digital marketing · mirAIreach
      </p>
      <p
        style={{
          marginTop: 20,
          fontSize: 20,
          fontWeight: 500,
          color: "rgba(26,23,20,0.38)",
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
        }}
      >
        miraireach.marketing
      </p>
    </div>
  );
}
