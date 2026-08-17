import { useState, useEffect } from "react";
import { PODCAST_PROMPTS } from "../types";
import { generatePodcastEmail } from "../utils/podcastEmailTemplate";
import type { PodcastYearEndEntry } from "../types";

interface PodcastFormProps {
  entry?: PodcastYearEndEntry;
  year: number;
  onSave: (podcastName: string, answers: Record<string, string>) => void;
}

export function PodcastYearEndForm({ entry, year, onSave }: PodcastFormProps) {
  const [podcastName, setPodcastName] = useState(entry?.podcastName ?? "");
  const [answers, setAnswers] = useState<Record<string, string>>(
    entry?.answers ?? {}
  );
  const [view, setView] = useState<"form" | "email">("form");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPodcastName(entry?.podcastName ?? "");
    setAnswers(entry?.answers ?? {});
    setView("form");
    setSaved(false);
  }, [year, entry]);

  function handleSave() {
    onSave(podcastName, answers);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const filled = PODCAST_PROMPTS.filter((p) => answers[p.id]?.trim()).length;
  const previewEntry: PodcastYearEndEntry = {
    year,
    podcastName,
    answers,
  };
  const email = generatePodcastEmail(previewEntry);

  function handleCopy() {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function renderMarkdown(text: string): string {
    return text
      .split(/\n\n+/)
      .map((para) => {
        const inner = para
          .split("\n")
          .map((line) => line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"))
          .join("<br/>");
        return `<p>${inner}</p>`;
      })
      .join("");
  }

  return (
    <div className="prompt-form">
      <div className="form-header">
        <h2>Podcast Year-End Email — {year}</h2>
        {view === "form" && (
          <span className="progress-badge podcast">
            {filled}/{PODCAST_PROMPTS.length} answered
          </span>
        )}
      </div>
      <p className="form-intro">
        Answer a few questions about your podcast year. The app will compile them into a ready-to-send listener email.
      </p>

      <div className="tab-bar">
        <button
          className={`tab ${view === "form" ? "active" : ""}`}
          onClick={() => setView("form")}
        >
          Prompts
        </button>
        <button
          className={`tab ${view === "email" ? "active" : ""}`}
          onClick={() => setView("email")}
        >
          Preview Email
        </button>
      </div>

      {view === "form" && (
        <>
          <div className="prompts" style={{ marginTop: 24 }}>
            <div className="prompt-item">
              <label className="prompt-question">What's your podcast called?</label>
              <input
                type="text"
                className="prompt-textarea"
                style={{ height: 44, resize: "none" }}
                placeholder="Show name"
                value={podcastName}
                onChange={(e) => setPodcastName(e.target.value)}
              />
            </div>
            {PODCAST_PROMPTS.map((p) => (
              <div key={p.id} className="prompt-item">
                <label className="prompt-question">{p.question}</label>
                <textarea
                  className="prompt-textarea"
                  rows={p.id === "episodes" ? 1 : 3}
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
        </>
      )}

      {view === "email" && (
        <div style={{ marginTop: 24 }}>
          <div className="letter-toolbar" style={{ marginBottom: 20 }}>
            <span style={{ fontSize: ".9rem", color: "var(--text-muted)", fontStyle: "italic" }}>
              Ready to copy into your email platform
            </span>
            <div className="toolbar-actions">
              <button className="btn-secondary" onClick={handleCopy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>
          <div
            className="letter-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(email) }}
          />
        </div>
      )}
    </div>
  );
}
