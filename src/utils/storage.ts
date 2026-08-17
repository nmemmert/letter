import type { AppData, MonthlyEntry, YearEndEntry, PodcastYearEndEntry } from "../types";

const KEY = "annual-letter-data";

const defaults: AppData = {
  name: "",
  monthlyEntries: [],
  yearEndEntries: [],
  podcastEntries: [],
};

export function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

export function save(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getMonthlyEntry(
  data: AppData,
  year: number,
  month: number
): MonthlyEntry | undefined {
  return data.monthlyEntries.find((e) => e.year === year && e.month === month);
}

export function upsertMonthlyEntry(
  data: AppData,
  entry: MonthlyEntry
): AppData {
  const idx = data.monthlyEntries.findIndex(
    (e) => e.year === entry.year && e.month === entry.month
  );
  const entries =
    idx >= 0
      ? data.monthlyEntries.map((e, i) => (i === idx ? entry : e))
      : [...data.monthlyEntries, entry];
  return { ...data, monthlyEntries: entries };
}

export function getYearEndEntry(
  data: AppData,
  year: number
): YearEndEntry | undefined {
  return data.yearEndEntries.find((e) => e.year === year);
}

export function upsertYearEndEntry(
  data: AppData,
  entry: YearEndEntry
): AppData {
  const idx = data.yearEndEntries.findIndex((e) => e.year === entry.year);
  const entries =
    idx >= 0
      ? data.yearEndEntries.map((e, i) => (i === idx ? entry : e))
      : [...data.yearEndEntries, entry];
  return { ...data, yearEndEntries: entries };
}

export function getPodcastEntry(
  data: AppData,
  year: number
): PodcastYearEndEntry | undefined {
  return data.podcastEntries.find((e) => e.year === year);
}

export function upsertPodcastEntry(
  data: AppData,
  entry: PodcastYearEndEntry
): AppData {
  const idx = data.podcastEntries.findIndex((e) => e.year === entry.year);
  const entries =
    idx >= 0
      ? data.podcastEntries.map((e, i) => (i === idx ? entry : e))
      : [...data.podcastEntries, entry];
  return { ...data, podcastEntries: entries };
}
