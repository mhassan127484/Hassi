export default function ProductTile({
  tile,
  image,
  label,
  indexLabel,
  className = "",
}: {
  tile: [string, string];
  image?: string;
  label?: string;
  indexLabel?: string;
  className?: string;
}) {
  const [a, b] = tile;

  if (image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={label ?? "Product"} className="h-full w-full object-cover" />
        {(label || indexLabel) && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0" />
            <div className="absolute inset-0 flex flex-col justify-between p-5 text-paper/90">
              {label && <span className="font-body text-xs uppercase tracking-widest">{label}</span>}
              {indexLabel && (
                <span className="self-end font-display text-5xl font-semibold leading-none opacity-30">
                  {indexLabel}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 120% at 25% 15%, ${a} 0%, ${b} 70%)`,
      }}
    >
      {/* soft light streak */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{
          background:
            "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.6) 42%, transparent 58%)",
        }}
      />
      {(label || indexLabel) && (
        <div className="absolute inset-0 flex flex-col justify-between p-5 text-paper/90">
          {label && <span className="font-body text-xs uppercase tracking-widest">{label}</span>}
          {indexLabel && (
            <span className="self-end font-display text-5xl font-semibold leading-none opacity-30">
              {indexLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
