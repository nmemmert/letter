export interface MonthlyEntry {
  year: number;
  month: number; // 0-indexed
  answers: Record<string, string>;
  completedAt?: string;
}

export interface YearEndEntry {
  year: number;
  answers: Record<string, string>;
  completedAt?: string;
}

export interface AppData {
  name: string;
  monthlyEntries: MonthlyEntry[];
  yearEndEntries: YearEndEntry[];
  podcastEntries: PodcastYearEndEntry[];
}

export const MONTHLY_PROMPTS: { id: string; question: string; placeholder: string }[] = [
  {
    id: "win",
    question: "What was your biggest win or achievement this month?",
    placeholder: "A project wrapped up, a goal reached, a moment of pride…",
  },
  {
    id: "challenge",
    question: "What challenged or surprised you most?",
    placeholder: "Something harder than expected, or that caught you off guard…",
  },
  {
    id: "learned",
    question: "What did you learn — about yourself, others, or the world?",
    placeholder: "A skill, an insight, something that shifted your perspective…",
  },
  {
    id: "memory",
    question: "What one moment do you most want to remember?",
    placeholder: "A conversation, a place, a feeling you don't want to forget…",
  },
  {
    id: "people",
    question: "Who showed up for you, or who did you show up for?",
    placeholder: "A friend, colleague, stranger — a connection that mattered…",
  },
  {
    id: "forward",
    question: "What are you carrying into next month?",
    placeholder: "An intention, a question, something left unfinished…",
  },
];

export const YEAR_END_PROMPTS: { id: string; question: string; placeholder: string }[] = [
  {
    id: "word",
    question: "What single word best captures your year?",
    placeholder: "Growth, chaos, turning, arrival…",
  },
  {
    id: "change",
    question: "What is the most important thing that changed this year?",
    placeholder: "In your life, your work, your relationships, yourself…",
  },
  {
    id: "identity",
    question: "What did this year teach you about who you are?",
    placeholder: "A strength discovered, a limit found, a value clarified…",
  },
  {
    id: "gratitude",
    question: "What are you most grateful for from this year?",
    placeholder: "A person, an opportunity, a difficulty that made you stronger…",
  },
  {
    id: "release",
    question: "What are you ready to leave behind?",
    placeholder: "A habit, a belief, a version of yourself you've outgrown…",
  },
  {
    id: "carry",
    question: "What are you carrying forward into next year?",
    placeholder: "A goal, a promise to yourself, something that matters deeply…",
  },
];

export interface PodcastYearEndEntry {
  year: number;
  podcastName: string;
  answers: Record<string, string>;
  completedAt?: string;
}

export const PODCAST_PROMPTS: { id: string; question: string; placeholder: string }[] = [
  {
    id: "episodes",
    question: "How many episodes did you publish this year?",
    placeholder: "52, 24, 10…",
  },
  {
    id: "favorite",
    question: "Which episode are you most proud of, and why?",
    placeholder: "Ep. 47 — it finally said what I'd been trying to say for months…",
  },
  {
    id: "top",
    question: "Which episode resonated most with listeners?",
    placeholder: "Most downloads, most replies, most shares…",
  },
  {
    id: "guest",
    question: "Who was your most memorable guest or conversation?",
    placeholder: "A guest who surprised you, challenged you, or moved you…",
  },
  {
    id: "growth",
    question: "How did the show grow or change this year?",
    placeholder: "New format, new audience, new confidence, new numbers…",
  },
  {
    id: "behind",
    question: "What happened behind the mic that listeners never heard?",
    placeholder: "A rough patch, a pivot, a decision made quietly…",
  },
  {
    id: "lesson",
    question: "What did podcasting teach you this year?",
    placeholder: "About storytelling, about yourself, about your audience…",
  },
  {
    id: "gratitude",
    question: "What do you most want to say to your listeners?",
    placeholder: "The thing you mean but don't always say out loud…",
  },
  {
    id: "next",
    question: "What's the one thing you want to do differently or more of next year?",
    placeholder: "A format change, a topic, a frequency, a commitment…",
  },
];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
