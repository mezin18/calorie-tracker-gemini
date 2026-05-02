import { useState } from "react";

const THEMES = [
  { id: "default", label: "כחול-ירוק", a: "#1e90ff", b: "#2ed573" },
  { id: "sunset",  label: "שקיעה",     a: "#ff6b6b", b: "#ffa502" },
  { id: "purple",  label: "סגול",      a: "#a855f7", b: "#ec4899" },
  { id: "ocean",   label: "אוקיינוס",  a: "#06b6d4", b: "#3b82f6" },
];

export default function SettingsView({ onBack, settings, onSave }) {
  const [theme, setTheme] = useState(settings.theme || "default");
  const [name,  setName]  = useState(settings.name  || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({ theme, name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="screen" dir="rtl">
      <header className="header">
        <button className="back-btn" onClick={onBack}>→</button>
        <h1 className="logo">הגדרות</h1>
        <div style={{ width: 44 }} />
      </header>

      <main className="settings-main">

        {/* שם */}
        <section className="settings-section">
          <p className="settings-section-title">👤 פרופיל</p>
          <div className="settings-card">
            <label className="settings-label">השם שלי</label>
            <input
              className="settings-input"
              type="text"
              placeholder="לדוגמה: יוסי"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </section>

        {/* ערכת נושא */}
        <section className="settings-section">
          <p className="settings-section-title">🎨 ערכת צבעים</p>
          <div className="settings-card">
            <div className="themes-grid">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`theme-btn ${theme === t.id ? "theme-selected" : ""}`}
                  onClick={() => setTheme(t.id)}
                  style={{ "--ta": t.a, "--tb": t.b }}
                >
                  <span className="theme-circle" style={{ background: `linear-gradient(135deg, ${t.a}, ${t.b})` }} />
                  <span className="theme-label">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <button className="settings-save-btn" onClick={handleSave}>
          {saved ? "✅ נשמר!" : "שמור הגדרות"}
        </button>

        <p className="settings-version">מד קלוריות v1.0 • נבנה עם ❤️</p>
      </main>
    </div>
  );
}
