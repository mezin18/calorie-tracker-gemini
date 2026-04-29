import { useState } from "react";
import { todayKey } from "../services/storage";

export default function DiaryView({ onBack, history, target }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDays = (offset) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek - offset * 7);

    const hebrewDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    return hebrewDays.map((label, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const key = d.toISOString().split("T")[0];
      return { label, key, cal: history[key] || 0 };
    });
  };

  const days = getWeekDays(weekOffset);
  const total = days.reduce((s, d) => s + d.cal, 0);
  const weekTarget = target * 7;
  const pct = Math.min((total / weekTarget) * 100, 100);
  const today = todayKey();

  return (
    <div className="screen" dir="rtl">
      <header className="header">
        <button className="back-btn" onClick={onBack}>→</button>
        <h1 className="logo">יומן קלוריות</h1>
        <div style={{ width: 44 }} />
      </header>

      <main className="diary-main">
        <div className="week-nav">
          <button
            className="week-btn"
            onClick={() => setWeekOffset((o) => o - 1)}
            disabled={weekOffset === 0}
            style={{ opacity: weekOffset === 0 ? 0.3 : 1 }}
          >‹</button>
          <span className="week-label">
            {weekOffset === 0 ? "שבוע נוכחי" : `לפני ${weekOffset} שבועות`}
          </span>
          <button className="week-btn" onClick={() => setWeekOffset((o) => o + 1)}>›</button>
        </div>

        <div className="diary-card">
          <div className="diary-nums">
            <span className="diary-total">{total.toLocaleString()}</span>
            <span className="diary-of"> / {weekTarget.toLocaleString()} קל'</span>
          </div>
          <p className="diary-sub">סה"כ קלוריות לשבוע זה</p>
          <div className="bar-bg">
            <div className="bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="days-card">
          <p className="days-title">פירוט יומי</p>
          {days.map((d, i) => {
            const isToday = d.key === today;
            const dayPct = Math.min((d.cal / target) * 100, 100);
            return (
              <div key={i} className={`day-row${isToday ? " day-today" : ""}`}>
                <div className="day-info">
                  <span className="day-name">{d.label}{isToday ? " (היום)" : ""}</span>
                  <div className="day-bar-bg">
                    <div className="day-bar-fill" style={{ width: `${dayPct}%` }} />
                  </div>
                </div>
                <span className="day-cal">{d.cal.toLocaleString()} קל'</span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
