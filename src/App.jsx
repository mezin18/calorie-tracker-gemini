import { useState, useEffect } from "react";
import CalorieRing from "./components/CalorieRing";
import AddButton from "./components/AddButton";
import ManualEntry from "./components/ManualEntry";
import DiaryView from "./components/DiaryView";
import SideMenu from "./components/SideMenu";
import SettingsView from "./components/SettingsView";
import { loadData, saveData, todayKey } from "./services/storage";

const THEME_COLORS = {
  default: { a: "#1e90ff", b: "#2ed573" },
  sunset:  { a: "#ff6b6b", b: "#ffa502" },
  purple:  { a: "#a855f7", b: "#ec4899" },
  ocean:   { a: "#06b6d4", b: "#3b82f6" },
};

function DateBadge({ name }) {
  const date = new Date().toLocaleDateString("he-IL", {
    weekday: "long", day: "numeric", month: "long",
  });
  return (
    <p className="date-badge">
      {name ? `היי ${name} 👋 · ` : ""}{date}
    </p>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState("main");

  const [targetCalories, setTargetCalories] = useState(2000);
  const [targetInput, setTargetInput] = useState("2000");
  const [history, setHistory] = useState({});
  const [currentCalories, setCurrentCalories] = useState(0);
  const [settings, setSettings] = useState({ geminiKey: "", theme: "default", name: "" });

  useEffect(() => {
    const saved = loadData();
    if (saved) {
      setTargetCalories(saved.target || 2000);
      setTargetInput(String(saved.target || 2000));
      setHistory(saved.history || {});
      setCurrentCalories(saved.history?.[todayKey()] || 0);
      if (saved.settings) setSettings(saved.settings);
    }
  }, []);

  useEffect(() => {
    saveData({ target: targetCalories, history, settings });
  }, [targetCalories, history, settings]);

  const themeColors = THEME_COLORS[settings.theme] || THEME_COLORS.default;

  const addCalories = (amount) => {
    const today = todayKey();
    const newVal = (history[today] || 0) + amount;
    const newHistory = { ...history, [today]: newVal };
    setHistory(newHistory);
    setCurrentCalories(newVal);
  };

  const handleReset = () => {
    const today = todayKey();
    setHistory({ ...history, [today]: 0 });
    setCurrentCalories(0);
    setMenuOpen(false);
  };

  const handleSetTarget = () => {
    const n = parseInt(targetInput);
    if (!isNaN(n) && n > 0) {
      setTargetCalories(n);
      setMenuOpen(false);
      setMenuView("main");
    }
  };

  const progress = Math.min((currentCalories / targetCalories) * 100, 100);
  const overLimit = currentCalories > targetCalories;

  if (screen === "manual")
    return <ManualEntry onBack={() => setScreen("home")} onAdd={(n) => { addCalories(n); setScreen("home"); }} />;
  if (screen === "diary")
    return <DiaryView onBack={() => setScreen("home")} history={history} target={targetCalories} />;
  if (screen === "settings")
    return <SettingsView onBack={() => setScreen("home")} settings={settings} onSave={setSettings} />;

  return (
    <div className="app" dir="rtl">
      <header className="header">
        <button className="menu-btn" onClick={() => { setMenuView("main"); setMenuOpen(true); }}>
          <span /><span /><span />
        </button>
        <h1
          className="logo"
          style={{
            background: `linear-gradient(135deg, ${themeColors.b}, ${themeColors.a})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          קלוריות
        </h1>
        <div style={{ width: 44 }} />
      </header>

      <main className="main">
        <DateBadge name={settings.name} />
        <CalorieRing
          current={currentCalories}
          target={targetCalories}
          progress={progress}
          over={overLimit}
          colorA={themeColors.a}
          colorB={themeColors.b}
        />
        <AddButton
          onManual={() => setScreen("manual")}
          onPhoto={addCalories}
          geminiKey={settings.geminiKey}
          colorA={themeColors.a}
          colorB={themeColors.b}
        />
      </main>

      {menuOpen && (
        <SideMenu
          view={menuView}
          setView={setMenuView}
          onClose={() => setMenuOpen(false)}
          onReset={handleReset}
          targetInput={targetInput}
          setTargetInput={setTargetInput}
          onSetTarget={handleSetTarget}
          onDiary={() => { setMenuOpen(false); setTimeout(() => setScreen("diary"), 200); }}
          onSettings={() => { setMenuOpen(false); setTimeout(() => setScreen("settings"), 200); }}
          colorA={themeColors.a}
          colorB={themeColors.b}
        />
      )}
    </div>
  );
}
