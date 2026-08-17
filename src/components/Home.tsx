import { MONTH_NAMES, MONTHLY_PROMPTS, PODCAST_PROMPTS, YEAR_END_PROMPTS } from "../types";
import type { AppData } from "../types";
import type { View } from "./Sidebar";

interface HomeProps {
  data: AppData;
  currentYear: number;
  currentMonth: number;
  onNavigate: (v: View) => void;
}

export function Home({ data, currentYear, currentMonth, onNavigate }: HomeProps) {
  const monthEntries = data.monthlyEntries.filter((e) => e.year === currentYear);
  const yearEnd = data.yearEndEntries.find((e) => e.year === currentYear);
  const podcast = data.podcastEntries?.find((e) => e.year === currentYear);

  const accessibleMonths = currentMonth + 1; // 0-indexed, months up to today
  const completedMonths = monthEntries.length;
  const pct = Math.round((completedMonths / 12) * 100);

  const yearEndFilled = yearEnd
    ? YEAR_END_PROMPTS.filter((p) => yearEnd.answers[p.id]?.trim()).length
    : 0;

  const podcastFilled = podcast
    ? PODCAST_PROMPTS.filter((p) => podcast.answers[p.id]?.trim()).length
    : 0;

  const pendingMonths = MONTH_NAMES.slice(0, currentMonth + 1).filter(
    (_, i) => !monthEntries.some((e) => e.month === i)
  );

  return (
    <div className="home">
      <div className="home-header">
        <div>
          <h1 className="home-year">{currentYear}</h1>
          <p className="home-sub">Your year, in progress.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => onNavigate({ kind: "month", year: currentYear, month: currentMonth })}
        >
          {monthEntries.some((e) => e.month === currentMonth)
            ? `Edit ${MONTH_NAMES[currentMonth]}`
            : `Start ${MONTH_NAMES[currentMonth]}`}
        </button>
      </div>

      {/* Progress bar */}
      <div className="home-section">
        <div className="progress-row">
          <span className="section-label">Monthly entries</span>
          <span className="progress-count">{completedMonths} / 12 months</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Month grid */}
      <div className="month-grid">
        {MONTH_NAMES.map((name, idx) => {
          const done = monthEntries.some((e) => e.month === idx);
          const isCurrent = idx === currentMonth;
          const isFuture = idx > currentMonth;
          const entry = monthEntries.find((e) => e.month === idx);
          const answeredCount = entry
            ? MONTHLY_PROMPTS.filter((p) => entry.answers[p.id]?.trim()).length
            : 0;

          return (
            <button
              key={idx}
              className={`month-card ${done ? "done" : ""} ${isCurrent ? "current" : ""} ${isFuture ? "future" : ""}`}
              disabled={isFuture}
              onClick={() => !isFuture && onNavigate({ kind: "month", year: currentYear, month: idx })}
            >
              <span className="month-card-name">{name.slice(0, 3)}</span>
              {done && (
                <span className="month-card-count">{answeredCount}/{MONTHLY_PROMPTS.length}</span>
              )}
              {!done && !isFuture && (
                <span className="month-card-pending">pending</span>
              )}
              {isFuture && <span className="month-card-future">—</span>}
            </button>
          );
        })}
      </div>

      {/* Checklist */}
      <div className="home-section">
        <div className="section-label" style={{ marginBottom: 14 }}>Year-end tasks</div>
        <div className="checklist">
          <ChecklistItem
            label="Year-End Reflections"
            detail={yearEnd ? `${yearEndFilled}/${YEAR_END_PROMPTS.length} answered` : "Not started"}
            done={yearEndFilled === YEAR_END_PROMPTS.length}
            partial={yearEndFilled > 0 && yearEndFilled < YEAR_END_PROMPTS.length}
            onClick={() => onNavigate({ kind: "yearEnd", year: currentYear })}
          />
          <ChecklistItem
            label="Podcast Year-End Email"
            detail={podcast ? `${podcastFilled}/${PODCAST_PROMPTS.length} answered` : "Not started"}
            done={podcastFilled === PODCAST_PROMPTS.length}
            partial={podcastFilled > 0 && podcastFilled < PODCAST_PROMPTS.length}
            onClick={() => onNavigate({ kind: "podcast", year: currentYear })}
          />
          <ChecklistItem
            label="Read Your Letter"
            detail={completedMonths > 0 ? `${completedMonths} month${completedMonths !== 1 ? "s" : ""} compiled` : "Fill in some months first"}
            done={false}
            partial={completedMonths > 0}
            onClick={() => onNavigate({ kind: "letter", year: currentYear })}
            isLink
          />
        </div>
      </div>

      {/* What's missing */}
      {pendingMonths.length > 0 && (
        <div className="home-section">
          <div className="section-label" style={{ marginBottom: 10 }}>Still to fill in</div>
          <div className="missing-months">
            {pendingMonths.map((name, i) => {
              const monthIdx = MONTH_NAMES.indexOf(name);
              return (
                <button
                  key={i}
                  className="missing-tag"
                  onClick={() => onNavigate({ kind: "month", year: currentYear, month: monthIdx })}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {pendingMonths.length === 0 && completedMonths > 0 && (
        <div className="home-all-done">
          All months up to {MONTH_NAMES[currentMonth]} are filled in.
        </div>
      )}
    </div>
  );
}

interface ChecklistItemProps {
  label: string;
  detail: string;
  done: boolean;
  partial: boolean;
  onClick: () => void;
  isLink?: boolean;
}

function ChecklistItem({ label, detail, done, partial, onClick, isLink }: ChecklistItemProps) {
  return (
    <button className={`checklist-item ${done ? "done" : partial ? "partial" : ""}`} onClick={onClick}>
      <span className={`check-icon ${done ? "done" : partial ? "partial" : ""}`}>
        {done ? "✓" : partial ? "◑" : "○"}
      </span>
      <span className="check-body">
        <span className="check-label">{label}</span>
        <span className="check-detail">{detail}</span>
      </span>
      <span className="check-arrow">{isLink ? "→" : done ? "" : "→"}</span>
    </button>
  );
}
