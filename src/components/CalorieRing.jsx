export default function CalorieRing({ current, target, progress, over, colorA = "#1e90ff", colorB = "#2ed573" }) {
  const r = 110;
  const circ = 2 * Math.PI * r;
  const dash = (progress / 100) * circ;
  const color = over ? "#ff4757" : progress > 80 ? "#ffa502" : colorB;

  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 260 260" className="ring-svg">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorA} />
            <stop offset="100%" stopColor={colorB} />
          </linearGradient>
        </defs>
        <circle cx="130" cy="130" r={r} fill="none" stroke="#1e2433" strokeWidth="18" />
        <circle
          cx="130" cy="130" r={r}
          fill="none"
          stroke={over ? "#ff4757" : "url(#ringGrad)"}
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ / 4}
          style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1), stroke 0.4s" }}
        />
      </svg>
      <div className="ring-inner">
        <span className="ring-num" style={{ color }}>{current.toLocaleString()}</span>
        <span className="ring-label">מתוך {target.toLocaleString()}</span>
        <span className="ring-sub">קלוריות היום</span>
      </div>
    </div>
  );
}
