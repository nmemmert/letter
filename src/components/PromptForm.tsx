import { useState, useEffect } from "react";
import type { MonthlyEntry, YearEndEntry } from "../types";
import { MONTHLY_PROMPTS, YEAR_END_PROMPTS, MONTH_NAMES } from "../types";

interface MonthlyFormProps {
  entry?: MonthlyEntry;
  year: number;
  month: number;
  onSave: (answers: Record<string, string>) => void;
}

export function MonthlyForm({ entry, year, month, onSave }: MonthlyFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    entry?.answers ?? {}
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAnswers(entry?.answers ?? {});
    setSaved(false);
  }, [year, month, entry]);

  function handleSave() {
    onSave(answers);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const filled = MONTHLY_PROMPTS.filter((p) => answers[p.id]?.trim()).length;

  return (
    <div className="prompt-form">
      <div className="form-header">
        <h2>
          {MONTH_NAMES[month]} {year}
        </h2>
        <span className="progress-badge">
          {filled}/{MONTHLY_PROMPTS.length} answered
        </span>
      </div>
      <div className="prompts">
        {MONTHLY_PROMPTS.map((p) => (
          <div key={p.id} className="prompt-item">
            <label className="prompt-question">{p.question}</label>
            <textarea
              className="prompt-textarea"
              rows={3}
              placeholder={p.placeholder}
              value={answers[p.id] ?? ""}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [p.id]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>
      <div className="form-footer">
        <button className="btn-primary" onClick={handleSave}>
          {saved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  );
}

interface YearEndFormProps {
  entry?: YearEndEntry;
  year: number;
  onSave: (answers: Record<string, string>) => void;
}

export function YearEndForm({ entry, year, onSave }: YearEndFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    entry?.answers ?? {}
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAnswers(entry?.answers ?? {});
    setSaved(false);
  }, [year, entry]);

  function handleSave() {
    onSave(answers);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const filled = YEAR_END_PROMPTS.filter((p) => answers[p.id]?.trim()).length;

  return (
    <div className="prompt-form year-end-form">
      <div className="form-header">
        <h2>Year-End Reflection — {year}</h2>
        <span className="progress-badge year-end">
          {filled}/{YEAR_END_PROMPTS.length} answered
        </span>
      </div>
      <p className="form-intro">
        The prompts that close the year and anchor the letter.
      </p>
      <div className="prompts">
        {YEAR_END_PROMPTS.map((p) => (
          <div key={p.id} className="prompt-item">
            <label className="prompt-question">{p.question}</label>
            <textarea
              className="prompt-textarea"
              rows={p.id === "word" ? 1 : 3}
              placeholder={p.placeholder}
              value={answers[p.id] ?? ""}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [p.id]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>
      <div className="form-footer">
        <button className="btn-primary" onClick={handleSave}>
          {saved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  );
}
