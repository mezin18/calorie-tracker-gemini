import { useState } from "react";

const ACTIVITY_LEVELS = [
  { id: "sedentary",  label: "אורח חיים יושבני",  sub: "עבודה משרדית, ללא אימונים",              factor: 1.2   },
  { id: "light",      label: "פעילות קלה",         sub: "אימונים קלים 1–3 פעמים בשבוע",          factor: 1.375 },
  { id: "moderate",   label: "פעילות מתונה",       sub: "אימונים בינוניים 3–5 פעמים בשבוע",      factor: 1.55  },
  { id: "high",       label: "פעילות גבוהה",       sub: "אימונים עצימים 6–7 פעמים בשבוע",        factor: 1.725 },
];

function InfoModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box info-modal" onClick={(e) => e.stopPropagation()} dir="rtl">
        <h3 className="info-title">📖 איך מחשבים את הקלוריות?</h3>

        <p className="info-section-title">שלב 1 — BMR (חילוף חומרים בסיסי)</p>
        <p className="info-text">ה-BMR הוא כמות הקלוריות שהגוף שורף במנוחה מוחלטת. משתמשים בנוסחת <strong>Mifflin-St Jeor</strong>:</p>
        <div className="info-formula">
          <p>👨 גבר: <code>(10 × משקל) + (6.25 × גובה) − (5 × גיל) + 5</code></p>
          <p>👩 אישה: <code>(10 × משקל) + (6.25 × גובה) − (5 × גיל) − 161</code></p>
        </div>

        <p className="info-section-title">שלב 2 — TDEE (סך צריכת אנרגיה יומית)</p>
        <p className="info-text">מכפילים את ה-BMR במקדם פעילות:</p>
        <div className="info-formula">
          <p>🪑 יושבני: <code>BMR × 1.2</code></p>
          <p>🚶 קל: <code>BMR × 1.375</code></p>
          <p>🏃 בינוני: <code>BMR × 1.55</code></p>
          <p>💪 גבוה: <code>BMR × 1.725</code></p>
        </div>
        <p className="info-text">התוצאה = כמות הקלוריות לשמירה על המשקל הנוכחי.</p>

        <button className="info-close-btn" onClick={onClose}>סגור</button>
      </div>
    </div>
  );
}

export default function CalorieCalculator({ onBack, currentTarget, onSetTarget, colorA = "#1e90ff", colorB = "#2ed573" }) {
  const [manualInput, setManualInput] = useState(String(currentTarget || ""));
  const [gender,      setGender]      = useState("male");
  const [age,         setAge]         = useState("");
  const [height,      setHeight]      = useState("");
  const [weight,      setWeight]      = useState("");
  const [activity,    setActivity]    = useState("sedentary");
  const [result,      setResult]      = useState(null);
  const [errors,      setErrors]      = useState({});
  const [showInfo,    setShowInfo]    = useState(false);
  const [saved,       setSaved]       = useState(false);

  const validate = () => {
    const e = {};
    const a = parseInt(age),   h = parseInt(height), w = parseInt(weight);
    if (!age   || isNaN(a) || a < 1  || a > 100) e.age    = "גיל חייב להיות בין 1 ל-100";
    if (!height|| isNaN(h) || h < 50 || h > 250) e.height = "גובה חייב להיות בין 50 ל-250 ס״מ";
    if (!weight|| isNaN(w) || w < 20 || w > 300) e.weight = "משקל חייב להיות בין 20 ל-300 ק״ג";
    return e;
  };

  const calculate = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const a = parseInt(age), h = parseInt(height), w = parseInt(weight);
    const bmr = gender === "male"
      ? (10 * w) + (6.25 * h) - (5 * a) + 5
      : (10 * w) + (6.25 * h) - (5 * a) - 161;

    const factor = ACTIVITY_LEVELS.find((l) => l.id === activity)?.factor || 1.2;
    const tdee = Math.round(bmr * factor);
    setResult(tdee);
    setSaved(false);
  };

  const handleSaveManual = () => {
    const n = parseInt(manualInput);
    if (!isNaN(n) && n > 0) { onSetTarget(n); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  const handleSaveCalculated = () => {
    if (result) { onSetTarget(result); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  return (
    <div className="screen" dir="rtl">
      <header className="header">
        <button className="back-btn" onClick={onBack}>→</button>
        <h1 className="logo" style={{ background: `linear-gradient(135deg, ${colorB}, ${colorA})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          חישוב קלוריות
        </h1>
        <div style={{ width: 44 }} />
      </header>

      <main className="calc-main">

        {/* ── קלוריות ידניות ── */}
        <section className="calc-section">
          <p className="calc-section-title">✏️ הגדרה ידנית</p>
          <div className="calc-card">
            <label className="calc-label">יעד קלוריות יומי</label>
            <div className="calc-row">
              <input
                className="calc-input"
                type="number"
                min="500"
                max="10000"
                placeholder="לדוגמה: 2000"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
              />
              <button
                className="calc-save-btn"
                onClick={handleSaveManual}
                style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})` }}
              >
                {saved ? "✅" : "שמור"}
              </button>
            </div>
          </div>
        </section>

        {/* ── חישוב אוטומטי ── */}
        <section className="calc-section">
          <div className="calc-section-header">
            <p className="calc-section-title">🧮 חישוב אוטומטי</p>
            <button className="info-btn" onClick={() => setShowInfo(true)}>?</button>
          </div>

          {/* מגדר */}
          <div className="calc-card">
            <label className="calc-label">מין</label>
            <div className="gender-row">
              <button
                className={`gender-btn ${gender === "male" ? "gender-active" : ""}`}
                onClick={() => setGender("male")}
                style={gender === "male" ? { background: `linear-gradient(135deg, ${colorA}, ${colorB})`, color: "#fff" } : {}}
              >👨 זכר</button>
              <button
                className={`gender-btn ${gender === "female" ? "gender-active" : ""}`}
                onClick={() => setGender("female")}
                style={gender === "female" ? { background: `linear-gradient(135deg, ${colorA}, ${colorB})`, color: "#fff" } : {}}
              >👩 נקבה</button>
            </div>
          </div>

          {/* גיל */}
          <div className="calc-card">
            <label className="calc-label">גיל (שנים)</label>
            <input
              className={`calc-input ${errors.age ? "input-error" : ""}`}
              type="number" min="1" max="100" placeholder="לדוגמה: 25"
              value={age}
              onChange={(e) => { setAge(e.target.value); setErrors((err) => ({ ...err, age: "" })); }}
            />
            {errors.age && <p className="error-msg">{errors.age}</p>}
          </div>

          {/* גובה */}
          <div className="calc-card">
            <label className="calc-label">גובה (ס״מ)</label>
            <input
              className={`calc-input ${errors.height ? "input-error" : ""}`}
              type="number" min="50" max="250" placeholder="לדוגמה: 175"
              value={height}
              onChange={(e) => { setHeight(e.target.value); setErrors((err) => ({ ...err, height: "" })); }}
            />
            {errors.height && <p className="error-msg">{errors.height}</p>}
          </div>

          {/* משקל */}
          <div className="calc-card">
            <label className="calc-label">משקל (ק״ג)</label>
            <input
              className={`calc-input ${errors.weight ? "input-error" : ""}`}
              type="number" min="20" max="300" placeholder="לדוגמה: 70"
              value={weight}
              onChange={(e) => { setWeight(e.target.value); setErrors((err) => ({ ...err, weight: "" })); }}
            />
            {errors.weight && <p className="error-msg">{errors.weight}</p>}
          </div>

          {/* רמת פעילות */}
          <div className="calc-card">
            <label className="calc-label">רמת פעילות גופנית</label>
            <div className="activity-list">
              {ACTIVITY_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  className={`activity-btn ${activity === lvl.id ? "activity-active" : ""}`}
                  onClick={() => setActivity(lvl.id)}
                  style={activity === lvl.id ? { borderColor: colorA, background: `${colorA}18` } : {}}
                >
                  <span className="activity-check" style={activity === lvl.id ? { background: colorA } : {}}>
                    {activity === lvl.id && "✓"}
                  </span>
                  <span>
                    <span className="activity-label">{lvl.label}</span>
                    <span className="activity-sub">{lvl.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* כפתור חישוב */}
          <button
            className="calc-calc-btn"
            onClick={calculate}
            style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})` }}
          >
            חשב קלוריות יעד 🔥
          </button>

          {/* תוצאה */}
          {result && (
            <div className="calc-result-card">
              <p className="result-label">הקלוריות המומלצות לשמירת המשקל:</p>
              <p className="result-number" style={{ color: colorA }}>{result.toLocaleString()}</p>
              <p className="result-unit">קלוריות ליום</p>
              <button
                className="result-save-btn"
                onClick={handleSaveCalculated}
                style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})` }}
              >
                {saved ? "✅ נשמר!" : "הגדר כיעד יומי"}
              </button>
            </div>
          )}
        </section>
      </main>

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </div>
  );
}
