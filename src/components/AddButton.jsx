import { useState, useRef } from "react";
import { analyzeMealCalories } from "../services/aiService";

export default function AddButton({ onManual, onPhoto, geminiKey, colorA = "#1e90ff", colorB = "#2ed573" }) {
  const [open, setOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOpen(false);

    setAnalyzing(true);
    setMsg("מנתח את הארוחה...");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result.split(",")[1];
        const mimeType = file.type || "image/jpeg";
        const cal = await analyzeMealCalories(base64, mimeType);
        setAnalyzing(false);
        if (cal > 0) {
          setMsg(`✅ זוהו ~${cal} קלוריות`);
          onPhoto(cal);
        } else {
          setMsg("❌ לא זוהה מאכל בתמונה. נסה שוב.");
        }
      } catch (err) {
        setAnalyzing(false);
        setMsg(`❌ שגיאה: ${err.message}`);
      }
      setTimeout(() => setMsg(""), 5000);
    };
    reader.onerror = () => {
      setAnalyzing(false);
      setMsg("❌ שגיאה בקריאת הקובץ");
      setTimeout(() => setMsg(""), 4000);
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
