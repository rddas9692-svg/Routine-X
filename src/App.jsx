// src/App.jsx
// ─────────────────────────────────────────
// Root component — owns ALL state.
// Passes data + callbacks down to pages.
//
// State needed:
//   activeTab  — which tab ('today' | 'stats' | 'profile')
//   modalOpen  — Add Habit sheet open/closed
//   habits     — array of habit objects  → localStorage hf2_habits
//   records    — array of check-ins      → localStorage hf2_records
//   profile    — { name, handle }        → localStorage hf2_profile
// ─────────────────────────────────────────

import { useState, useEffect } from "react";
import BottomNav from "./components/BottomNav";
import TodayPage from "./components/TodayPage";
import StatsPage from "./components/StatsPage";
import ProfilePage from "./components/ProfilePage";
import AddModal from "./components/AddModal";
import { seedHabits, seedRecords } from "./data/seed";
import { todayKey, toggleRecord } from "./data/utils";

function App() {
  // --- write state and handlers here in class ---
  const [activeTab, setActiveTab] = useState("today");
  const [modalOpen, setModalOpen] = useState(false);

  //Two independent pieces of UI state at the top of App. simple

  //Rule of thumb: if state is needed by multiple components, it should be lifted to the nearest common ancestor. If state is only needed by one component, it should be kept in that component.
  const [habits, setHabits] = useState(() => {
    const raw = localStorage.getItem("hf2_habits");
    if (raw !== null) return JSON.parse(raw);

    const h = seedHabits();
    const r = seedRecords(h);
    localStorage.setItem("hf2_habits", JSON.stringify(h));
    localStorage.setItem("hf2_records", JSON.stringify(r));
    return h;
  });

  const [records, setRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hf2_records")) || "[]";
    } catch {
      return "[]";
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("hf2_profile") || '{"name":"","handle":""}',
      );
    } catch {
      return { name: "", handle: "" };
    }
  });

  //UseEffect is hook!
  // sideneffects: things that happen outside of the component, like localStorage, network requests, subscriptions, timers, etc.
  // dependency array: if any of the values in the array change, the effect will run again. If the array is empty, the effect will only run once, after the initial render.

  //anatomy of useEffect:
  // useEffect(
  //   // ()=>{}  -> the effect function, ---- what to do.
  //   // [habits] or [] ----> when to do it.
  // )

  // **The dependency array — three cases:**
  //   ```jsx
  //   // Case 1: Array with values → runs on mount AND whenever those values change
  //   useEffect(() => { ... }, [habits])

  //   // Case 2: Empty array → runs ONCE on mount, never again
  //   useEffect(() => { ... }, [])

  //   // Case 3: No array at all → runs on EVERY render (almost never what you want)
  //   useEffect(() => { ... })

  // useEffect(() => {
  //   console.log("useEffect loads")
  // }, [])

  useEffect(() => {
    localStorage.setItem("hf2_habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("hf2_records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("hf2_profile", JSON.stringify(profile));
  }, [profile]);

  function handleToggle(id) {
    setRecords((p) => toggleRecord(p, id, todayKey(), "done"));
  }
  function handleSkip(id) {
    setRecords((p) => toggleRecord(p, id, todayKey(), "skip"));
  }

  function handleDelete(id) {
    setHabits((p) => p.filter((h) => h.id !== id));
    setRecords((p) => p.filter((r) => r.habitId !== id));
  }

  function handleAdd(name, emoji) {
    setHabits((p) => [
      ...p,
      { id: Date.now().toString(), name, emoji, createdAt: todayKey() },
    ]);
    setModalOpen(false);
  }

  function handleSaveProfile(name, handle) {
    setProfile({ name, handle });
  }

  return (
    <div className="app">
      {/* conditional rendering of active page */}
      {/* condition && <Componet/> */}

      <div className="scroll-area">
        {activeTab === "today" && (
          <TodayPage
            habits={habits}
            records={records}
            profile={profile}
            onToggle={handleToggle}
            onSkip={handleSkip}
            onDelete={handleDelete}
            onOpenModal={() => setModalOpen(true)}
          />
        )}
        {/* { activeTab === 'today' && <TodayPage habits={habits} records={records} onToggle={() => {}} onSkip={() => {}} onDelete={() => {}} onOpenModal={() => {}} /> } */}
        {activeTab === "stats" && (
          <StatsPage habits={habits} records={records} />
        )}
        {activeTab === "profile" && (
          <ProfilePage
            profile={profile}
            habits={habits}
            records={records}
            onSaveProfile={handleSaveProfile}
          />
        )}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <AddModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}

export default App;
