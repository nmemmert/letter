import { MONTH_NAMES } from "../types";
import type { AppData } from "../types";

export type View =
  | { kind: "home" }
  | { kind: "month"; year: number; month: number }
  | { kind: "yearEnd"; year: number }
  | { kind: "letter"; year: number }
  | { kind: "podcast"; year: number }
  | { kind: "allYears" };

interface SidebarProps {
  data: AppData;
  view: View;
  onViewChange: (v: View) => void;
  currentYear: number;
  currentMonth: number;
}

export function Sidebar({
  data,
  view,
  onViewChange,
  currentYear,
  currentMonth,
}: SidebarProps) {
  const years = getRelevantYears(currentYear);

  return (
    <nav className="sidebar">
      <button
        className={`sidebar-brand ${view.kind === "home" ? "sidebar-brand-active" : ""}`}
        onClick={() => onViewChange({ kind: "home" })}
        style={{ cursor: "pointer", background: "none", border: "none", width: "100%", textAlign: "left" }}
      >
        <span className="brand-icon">✉</span>
        <span className="brand-name">Annual Letter</span>
      </button>

      <ul className="sidebar-months" style={{ marginBottom: 8 }}>
        <li>
          <button
            className={`sidebar-item sidebar-letter ${view.kind === "allYears" ? "active" : ""}`}
            onClick={() => onViewChange({ kind: "allYears" })}
          >
            <span className="sidebar-item-name">📚 All Years</span>
          </button>
        </li>
      </ul>

      {years.map((year) => {
        const monthEntries = data.monthlyEntries.filter((e) => e.year === year);
        const yearEndEntry = data.yearEndEntries.find((e) => e.year === year);
        const podcastEntry = data.podcastEntries?.find((e) => e.year === year);

        return (
          <div key={year} className="sidebar-year-section">
            <div className="sidebar-year-label">{year}</div>

            <ul className="sidebar-months">
              {MONTH_NAMES.map((name, idx) => {
                const isFuture = year === currentYear && idx > currentMonth;
                if (isFuture) return null;

                const hasEntry = monthEntries.some((e) => e.month === idx);
                const isActive =
                  view.kind === "month" &&
                  view.year === year &&
                  view.month === idx;
                const isCurrent = year === currentYear && idx === currentMonth;

                return (
                  <li key={idx}>
                    <button
                      className={`sidebar-item ${isActive ? "active" : ""} ${isCurrent ? "current" : ""}`}
                      onClick={() =>
                        onViewChange({ kind: "month", year, month: idx })
                      }
                    >
                      <span className="sidebar-item-name">{name}</span>
                      {hasEntry && <span className="dot" />}
                    </button>
                  </li>
                );
              })}

              <li>
                <button
                  className={`sidebar-item sidebar-yearend ${view.kind === "yearEnd" && view.year === year ? "active" : ""}`}
                  onClick={() => onViewChange({ kind: "yearEnd", year })}
                >
                  <span className="sidebar-item-name">Year-End</span>
                  {yearEndEntry && <span className="dot" />}
                </button>
              </li>

              <li>
                <button
                  className={`sidebar-item sidebar-letter ${view.kind === "letter" && view.year === year ? "active" : ""}`}
                  onClick={() => onViewChange({ kind: "letter", year })}
                >
                  <span className="sidebar-item-name">📄 Read Letter</span>
                </button>
              </li>

              <div className="sidebar-section-header">Podcast</div>
              <li>
                <button
                  className={`sidebar-item sidebar-podcast ${view.kind === "podcast" && view.year === year ? "active" : ""}`}
                  onClick={() => onViewChange({ kind: "podcast", year })}
                >
                  <span className="sidebar-item-name">🎙 Year-End Email</span>
                  {podcastEntry && <span className="dot" />}
                </button>
              </li>
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function getRelevantYears(currentYear: number): number[] {
  const years = [currentYear];
  for (let y = currentYear - 1; y >= currentYear - 3; y--) {
    years.push(y);
  }
  return years;
}
