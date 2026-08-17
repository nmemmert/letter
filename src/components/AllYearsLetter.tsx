import { useRef } from "react";
import { generateLetter } from "../utils/letterTemplate";
import type { AppData } from "../types";

interface AllYearsLetterProps {
  data: AppData;
}

export function AllYearsLetter({ data }: AllYearsLetterProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const years = Array.from(
    new Set([
      ...data.monthlyEntries.map((e) => e.year),
      ...data.yearEndEntries.map((e) => e.year),
    ])
  ).sort((a, b) => b - a); // newest first

  if (years.length === 0) {
    return (
      <div className="letter-view">
        <h2>All Years</h2>
        <p style={{ color: "var(--text-muted)", marginTop: 16, fontStyle: "italic" }}>
          No entries yet. Fill in some months to see your letters here.
        </p>
      </div>
    );
  }

  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    const lines: string[] = [];
    for (const year of [...years].reverse()) {
      lines.push(generateLetter(data, year));
      lines.push("\n\n" + "─".repeat(60) + "\n\n");
    }
    const blob = new Blob([lines.join("")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name || "my"}-letters-all-years.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="letter-view">
      <div className="letter-toolbar">
        <h2>All Years</h2>
        <div className="toolbar-actions">
          <button className="btn-secondary" onClick={handleDownload}>
            Download all
          </button>
          <button className="btn-secondary" onClick={handlePrint}>
            Export PDF
          </button>
        </div>
      </div>

      <div ref={contentRef} className="all-years-content">
        {[...years].reverse().map((year, i) => {
          const letter = generateLetter(data, year);
          const rendered = renderMarkdown(letter);
          return (
            <div key={year} className="year-letter-block print-page-break">
              {i > 0 && <div className="year-divider" />}
              <div
                className="letter-content"
                dangerouslySetInnerHTML={{ __html: rendered }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderMarkdown(text: string): string {
  return text
    .split(/\n\n+/)
    .map((para) => {
      const inner = para
        .split("\n")
        .map((line) => {
          line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
          line = line.replace(/\*(.+?)\*/g, "<em>$1</em>");
          return line;
        })
        .join("<br/>");
      return `<p>${inner}</p>`;
    })
    .join("");
}
