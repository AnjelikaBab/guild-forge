export function LoadingSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
        padding: "2rem",
        color: "var(--muted)",
      }}
    >
      <div
        aria-hidden
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)",
          animation: "spin 0.85s linear infinite",
        }}
      />
      <span>{label}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
