import { useState, useRef } from "react";

async function analyzeWithGemini(imageBase64, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
            { text: "כמה קלוריות בערך יש במאכל שבתמונה? החזר אך ורק מספר שלם שמייצג את סך הקלוריות. ללא הסברים, רק מספר." },
          ],
        }],
      }),
    }
  );
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "0";
  const calories = parseInt(text.replace(/[^0-9]/g, ""));
  return isNaN(calories) ? 0 : calories;
}

export default function AddButton({ onManual, onPhoto, geminiKey, colorA = "#1e90ff", colorB = "#2ed573" }) {
  const [open, setOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOpen(false);

    if (!geminiKey) {
      setMsg("⚠️ הגדר Gemini API Key בהגדרות");
      setTimeout(() => setMsg(""), 4000);
      e.target.value = "";
      return;
    }

    setAnalyzing(true);
    setMsg("מנתח את הארוחה...");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result.split(",")[1];
        const cal = await analyzeWithGemini(base64, geminiKey);
        setAnalyzing(false);
        if (cal > 0) {
          setMsg(`✅ זוהו ~${cal} קלוריות`);
          onPhoto(cal);
        } else {
          setMsg("❌ לא הצלחנו לזהות. נסה שוב.");
        }
      } catch {
        setAnalyzing(false);
        setMsg("❌ שגיאה בניתוח. בדוק את ה-API Key.");
      }
      setTimeout(() => setMsg(""), 3500);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="add-section">
      {msg && <div className="toast">{msg}</div>}
      {analyzing && (
        <div className="analyzing">
          <div className="spinner" style={{ borderTopColor: colorA }} />
          <span style={{ color: colorA }}>מנתח עם AI...</span>
        </div>
      )}

      <button
        className="fab"
        onClick={() => setOpen(true)}
        style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})`, boxShadow: `0 8px 24px ${colorA}55` }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="28" height="28">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        הוסף קלוריות
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">איך תרצה להוסיף?</p>
            <button className="modal-opt" onClick={() => { setOpen(false); onManual(); }}>
              <span className="opt-icon">✏️</span>
              <span>הכנסה ידנית</span>
            </button>
            <hr className="modal-hr" />
            <button className="modal-opt" onClick={() => fileRef.current?.click()}>
              <span className="opt-icon">📷</span>
              <span>העלאת תמונת ארוחה (AI)</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFile} />
          </div>
        </div>
      )}
    </div>
  );
}
