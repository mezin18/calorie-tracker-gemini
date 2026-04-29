import { useState } from "react";

export default function ManualEntry({ onBack, onAdd }) {
  const [val, setVal] = useState("");

  const submit = () => {
    const n = parseInt(val);
    if (!isNaN(n) && n > 0) onAdd(n);
  };

  return (
    <div className="screen" dir="rtl">
      <header className="header">
        <button className="back-btn" onClick={onBack}>→</button>
        <h1 className="logo">הכנסה ידנית</h1>
        <div style={{ width: 44 }} />
      </header>
      <main className="main" style={{ justifyContent: "center", gap: 24 }}>
        <p className="manual-prompt">כמה קלוריות אכלת?</p>
        <input
          className="manual-input"
          type="number"
          placeholder="לדוגמה: 350"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          autoFocus
        />
        <button className="save-btn" onClick={submit}>הוסף ליומן</button>
      </main>
    </div>
  );
}
