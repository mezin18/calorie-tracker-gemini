export default function SideMenu({
  view, setView, onClose, onReset,
  targetInput, setTargetInput, onSetTarget,
  onDiary, onSettings, colorA = "#1e90ff", colorB = "#2ed573",
}) {
  return (
    <div className="menu-overlay" onClick={onClose}>
      <aside className="menu-panel" onClick={(e) => e.stopPropagation()} dir="rtl">
        {view === "main" && (
          <>
            <h2 className="menu-title" style={{ background: `linear-gradient(135deg, ${colorB}, ${colorA})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              תפריט
            </h2>
            <nav className="menu-nav">
              <button className="menu-item" onClick={() => setView("target")}>
                <span className="mi-icon">🎯</span> שינוי יעד יומי
              </button>
              <button className="menu-item" onClick={onDiary}>
                <span className="mi-icon">📅</span> יומן קלוריות
              </button>
              <button className="menu-item" onClick={onSettings}>
                <span className="mi-icon">⚙️</span> הגדרות
              </button>
            </nav>
            <div className="menu-divider" />
            <button className="menu-reset" onClick={onReset}>
              <span className="mi-icon">🔄</span> אפס נתונים ליום חדש
            </button>
          </>
        )}

        {view === "target" && (
          <>
            <button className="back-link" onClick={() => setView("main")}>→ חזור</button>
            <h2 className="menu-title">שינוי יעד יומי</h2>
            <p className="menu-label">הזן את היעד החדש שלך:</p>
            <input
              className="menu-input"
              type="number"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
            />
            <button
              className="menu-save"
              onClick={onSetTarget}
              style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})` }}
            >
              שמור יעד
            </button>
          </>
        )}

        <button className="menu-close-text" onClick={onClose}>סגור תפריט</button>
      </aside>
    </div>
  );
}
