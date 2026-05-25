import { useState, useEffect } from "react";
import { navItems } from "./data/navItems";
import Sidebar from "./components/Sidebar";
import UpgradePopup from "./components/UpgradePopup";

// Pages
import HomeContent from "./pages/HomeContent";
import WorkoutContent from "./pages/WorkoutContent";
import VideoContent from "./pages/VideoContent";
import NutritionContent from "./pages/NutritionContent";
import BMIContent from "./pages/BMIContent";
import ProgressContent from "./pages/ProgressContent";
import ScheduleContent from "./pages/ScheduleContent";
import ProfileContent from "./pages/ProfileContent";

export default function Dashboard({ onLogout, onNavigate }) {
  const [active, setActive] = useState(() => sessionStorage.getItem("fitinDashboardTab") || "home");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("fitinDashboardTab", active);
  }, [active]);
  const isPremium = localStorage.getItem("fitinPremium") === "true";
  const [showPopup, setShowPopup] = useState(!isPremium);

  const user = JSON.parse(localStorage.getItem("fitinUser") || '{"name":"Athlete"}');

  const handleUpgrade = () => {
    setShowPopup(false);
    onNavigate("payment");
  };

  const renderContent = () => {
    switch (active) {
      case "home": return <HomeContent user={user} />;
      case "workout": return <WorkoutContent />;
      case "video": return <VideoContent />;
      case "nutrition": return <NutritionContent onNavigate={onNavigate} />;
      case "bmi": return <BMIContent />;
      case "progress": return <ProgressContent />;
      case "schedule": return <ScheduleContent />;
      case "profile": return <ProfileContent onLogout={onLogout} />;
      default: return <HomeContent user={user} />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#0a0a0a", fontFamily: "'Trebuchet MS', sans-serif" }}>

      {showPopup && (
        <UpgradePopup
          onClose={() => setShowPopup(false)}
          onUpgrade={handleUpgrade}
        />
      )}

      <Sidebar
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
          style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <h1 className="text-white font-bold text-lg capitalize">
            {navItems.find(n => n.key === active)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            {!isPremium ? (
              <button
                onClick={() => { setShowPopup(false); onNavigate("payment"); }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-yellow-400 transition-all hover:brightness-110"
                style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
                ⭐ Upgrade
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold text-yellow-400"
                style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
                ⭐ Premium
              </span>
            )}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg,#e03030,#1a6ebd)" }}>
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </div>
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
}
