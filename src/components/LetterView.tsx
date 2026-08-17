import { useState } from "react";
import { generateLetter } from "../utils/letterTemplate";
import type { AppData } from "../types";

interface LetterViewProps {
  data: AppData;
  year: number;
}

export function LetterView({ data, year }: LetterViewProps) {
  const [copied, setCopied] = useState(false);
  const letter = generateLetter(data, year);

  function handleCopy() {
    navigator.clipboard.writeText(letter).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${year}-annual-letter.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const rendered = renderMarkdown(letter);

  return (
    <div className="letter-view">
      <div className="letter-toolbar">
        <h2>{year} Annual Letter</h2>
        <div className="toolbar-actions">
          <button className="btn-secondary" onClick={handleCopy}>
            {copied ? "Copied ✓" : "Copy"}
          </button>
          <button className="btn-secondary" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
      <div
        className="letter-content"
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    </div>
  );
}

function renderMarkdown(text: string): string {
  // Split on double newlines into paragraphs
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
