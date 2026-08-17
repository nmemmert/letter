import { MONTH_NAMES } from "../types";
import type { AppData } from "../types";

export function generateLetter(data: AppData, year: number): string {
  const name = data.name || "Friend";
  const entries = data.monthlyEntries
    .filter((e) => e.year === year)
    .sort((a, b) => a.month - b.month);
  const yearEnd = data.yearEndEntries.find((e) => e.year === year);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let letter = `${year} Annual Letter\n`;
  letter += `Written ${dateStr}\n\n`;
  letter += `Dear ${name},\n\n`;

  if (yearEnd?.answers.word) {
    letter += `If ${year} had a single word, it would be: *${yearEnd.answers.word}*.\n\n`;
  }

  if (entries.length === 0 && !yearEnd) {
    letter +=
      "This letter is still being written. Return here at the end of the year to read it.\n";
    return letter;
  }

  // Monthly narrative
  if (entries.length > 0) {
    letter += `Here is what the months held:\n\n`;
    for (const entry of entries) {
      const monthName = MONTH_NAMES[entry.month];
      letter += `**${monthName}**\n`;
      const parts: string[] = [];

      if (entry.answers.win)
        parts.push(`The month's bright spot: ${entry.answers.win}.`);
      if (entry.answers.challenge)
        parts.push(`You were tested by: ${entry.answers.challenge}.`);
      if (entry.answers.learned)
        parts.push(`You learned: ${entry.answers.learned}.`);
      if (entry.answers.memory)
        parts.push(`The moment to hold onto: ${entry.answers.memory}.`);
      if (entry.answers.people)
        parts.push(`The people in the picture: ${entry.answers.people}.`);
      if (entry.answers.forward)
        parts.push(`Carrying forward: ${entry.answers.forward}.`);

      letter += parts.join("\n") + "\n\n";
    }
  }

  // Year-end reflections
  if (yearEnd) {
    letter += `**Looking back at the full year:**\n\n`;
    if (yearEnd.answers.change)
      letter += `The most important thing that changed: ${yearEnd.answers.change}\n\n`;
    if (yearEnd.answers.identity)
      letter += `What the year taught you about yourself: ${yearEnd.answers.identity}\n\n`;
    if (yearEnd.answers.gratitude)
      letter += `What you were most grateful for: ${yearEnd.answers.gratitude}\n\n`;
    if (yearEnd.answers.release)
      letter += `What you're ready to leave behind: ${yearEnd.answers.release}\n\n`;
    if (yearEnd.answers.carry)
      letter += `What you're carrying forward: ${yearEnd.answers.carry}\n\n`;
  }

  const completedMonths = entries.length;
  if (completedMonths < 12) {
    const remaining = 12 - completedMonths;
    letter += `*${remaining} month${remaining !== 1 ? "s" : ""} of this year are still being written.*\n\n`;
  }

  letter += `With love,\n${name} — ${year}`;
  return letter;
}
