export default function SideMenu({
  view, setView, onClose, onReset,
  onDiary, onSettings, onCalorieCalc,
  colorA = "#1e90ff", colorB = "#2ed573",
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
              <button className="menu-item" onClick={onCalorieCalc}>
                <span className="mi-icon">🧮</span> חישוב קלוריות מותאם
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

        <button className="menu-close-text" onClick={onClose}>סגור תפריט</button>
      </aside>
    </div>
  );
}
