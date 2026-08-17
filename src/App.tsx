import { useState, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import type { View } from "./components/Sidebar";
import { MonthlyForm, YearEndForm } from "./components/PromptForm";
import { LetterView } from "./components/LetterView";
import { Welcome } from "./components/Welcome";
import { PodcastYearEndForm } from "./components/PodcastYearEnd";
import { Home } from "./components/Home";
import {
  load,
  save,
  getMonthlyEntry,
  upsertMonthlyEntry,
  getYearEndEntry,
  upsertYearEndEntry,
  getPodcastEntry,
  upsertPodcastEntry,
} from "./utils/storage";
import type { AppData } from "./types";

const now = new Date();
const TODAY_YEAR = now.getFullYear();
const TODAY_MONTH = now.getMonth();

export default function App() {
  const [data, setData] = useState<AppData>(load);
  const [view, setView] = useState<View>({ kind: "home" });

  const persist = useCallback((next: AppData) => {
    setData(next);
    save(next);
  }, []);

  function handleStart(name: string) {
    persist({ ...data, name });
  }

  if (!data.name) {
    return (
      <Welcome
        currentMonth={TODAY_MONTH}
        currentYear={TODAY_YEAR}
        onStart={handleStart}
      />
    );
  }

  return (
    <div className="layout">
      <Sidebar
        data={data}
        view={view}
        onViewChange={setView}
        currentYear={TODAY_YEAR}
        currentMonth={TODAY_MONTH}
      />
      <main className="main">
        {view.kind === "home" && (
          <Home
            data={data}
            currentYear={TODAY_YEAR}
            currentMonth={TODAY_MONTH}
            onNavigate={setView}
          />
        )}
        {view.kind === "month" && (
          <MonthlyForm
            key={`${view.year}-${view.month}`}
            entry={getMonthlyEntry(data, view.year, view.month)}
            year={view.year}
            month={view.month}
            onSave={(answers) => {
              persist(
                upsertMonthlyEntry(data, {
                  year: view.year,
                  month: view.month,
                  answers,
                  completedAt: new Date().toISOString(),
                })
              );
            }}
          />
        )}
        {view.kind === "yearEnd" && (
          <YearEndForm
            key={view.year}
            entry={getYearEndEntry(data, view.year)}
            year={view.year}
            onSave={(answers) => {
              persist(
                upsertYearEndEntry(data, {
                  year: view.year,
                  answers,
                  completedAt: new Date().toISOString(),
                })
              );
            }}
          />
        )}
        {view.kind === "letter" && (
          <LetterView data={data} year={view.year} />
        )}
        {view.kind === "podcast" && (
          <PodcastYearEndForm
            key={view.year}
            entry={getPodcastEntry(data, view.year)}
            year={view.year}
            onSave={(podcastName, answers) => {
              persist(
                upsertPodcastEntry(data, {
                  year: view.year,
                  podcastName,
                  answers,
                  completedAt: new Date().toISOString(),
                })
              );
            }}
          />
        )}
      </main>
    </div>
  );
}
