import { useState, useRef } from "react";
import { analyzeMealCalories } from "../services/aiService";

const MAX_DESC_LENGTH = 80;

export default function AddButton({ onManual, onPhoto, colorA = "#1e90ff", colorB = "#2ed573" }) {
  const [open,        setOpen]        = useState(false);
  const [analyzing,   setAnalyzing]   = useState(false);
  const [msg,         setMsg]         = useState("");

  const [showPreview, setShowPreview] = useState(false);
  const [images,      setImages]      = useState([]);
  const [description, setDescription] = useState("");

  const fileRef   = useRef();
  const addImgRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setOpen(false);
    const reader = new FileReader();
    reader.onload = () => {
      setImages([{ base64: reader.result.split(",")[1], mimeType: file.type || "image/jpeg", dataUrl: reader.result }]);
      setDescription("");
      setShowPreview(true);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = () => {
      setImages((prev) => [...prev.slice(0, 1), { base64: reader.result.split(",")[1], mimeType: file.type || "image/jpeg", dataUrl: reader.result }]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleAnalyze = async () => {
    if (images.length === 0) return;
    setShowPreview(false);
    setAnalyzing(true);
    setMsg("מנתח את הארוחה...");
    try {
      const cal = await analyzeMealCalories(
        images.map((img) => ({ base64: img.base64, mimeType: img.mimeType })),
        description.trim()
      );
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

  const handleCancelPreview = () => {
    setShowPreview(false);
    setImages([]);
    setDescription("");
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
          <line x1="5"  y1="12" x2="19" y2="12" />
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
              <span>צילום / העלאת תמונת ארוחה (AI)</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFile} />
          </div>
        </div>
      )}

      {showPreview && (
        <div className="modal-overlay" style={{ alignItems: "center" }} onClick={handleCancelPreview}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()} dir="rtl">
            <p className="preview-title">📸 תצוגה מקדימה</p>

            <div className="preview-images">
              {images.map((img, idx) => (
                <div key={idx} className="preview-img-wrap">
                  <img src={img.dataUrl} alt={`תמונה ${idx + 1}`} className="preview-img" />
                  <button className="preview-remove-btn" onClick={() => handleRemoveImage(idx)}>×</button>
                </div>
              ))}

              {images.length < 2 && (
                <button
                  className="preview-add-img-btn"
                  onClick={() => addImgRef.current?.click()}
                  style={{ borderColor: colorA, color: colorA }}
                >
                  <span style={{ fontSize: 30, lineHeight: 1 }}>+</span>
                  <span style={{ fontSize: 12, textAlign: "center", lineHeight: 1.4 }}>
                    הוסף תמונה מזווית שונה<br />לדיוק מירבי<br />
                    <span style={{ color: "#6e7681", fontSize: 11 }}>(אותו מאכל בלבד!)</span>
                  </span>
                </button>
              )}
            </div>

            <input ref={addImgRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleAddImage} />

            <div className="preview-desc-wrap">
              <label className="preview-desc-label">
                📝 הוסף תיאור לדיוק מירבי
                <span className="preview-desc-hint"> (לדוגמה: "2 שניצלים ביתיים", "סלט חזה עוף")</span>
              </label>
              <div className="preview-desc-input-wrap">
                <input
                  className="preview-desc-input"
                  type="text"
                  placeholder="תאר את המאכל..."
                  value={description}
                  maxLength={MAX_DESC_LENGTH}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <span className={`desc-counter${description.length >= MAX_DESC_LENGTH ? " desc-counter-max" : ""}`}>
                  {description.length}/{MAX_DESC_LENGTH}
                </span>
              </div>
            </div>

            <div className="preview-actions">
              <button className="preview-cancel-btn" onClick={handleCancelPreview}>ביטול</button>
              <button
                className="preview-analyze-btn"
                onClick={handleAnalyze}
                disabled={images.length === 0}
                style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})` }}
              >
                🔍 שלח לניתוח
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
