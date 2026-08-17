import type { PodcastYearEndEntry } from "../types";

export function generatePodcastEmail(entry: PodcastYearEndEntry): string {
  const { answers, podcastName, year } = entry;
  const show = podcastName || "the show";

  let email = `Subject: Looking back on ${year} — thank you\n\n`;
  email += `Hey everyone,\n\n`;

  // Opening
  if (answers.episodes) {
    email += `${year} was a big year for ${show}. We published ${answers.episodes} episode${Number(answers.episodes) !== 1 ? "s" : ""} together — `;
    email += `and I've been sitting with what that means.\n\n`;
  } else {
    email += `As ${year} winds down, I wanted to take a moment to look back — with you.\n\n`;
  }

  // Favorite episode
  if (answers.favorite) {
    email += `The episode I'm most proud of this year: ${answers.favorite}\n\n`;
  }

  // Top episode
  if (answers.top) {
    email += `And the one that resonated most with all of you: ${answers.top}\n\n`;
  }

  // Guest
  if (answers.guest) {
    email += `My most memorable conversation: ${answers.guest}\n\n`;
  }

  // Growth / behind the scenes
  if (answers.growth || answers.behind) {
    email += `**Behind the scenes:**\n\n`;
    if (answers.growth) email += `${answers.growth}\n\n`;
    if (answers.behind) email += `${answers.behind}\n\n`;
  }

  // Lesson
  if (answers.lesson) {
    email += `**What this year taught me:**\n\n${answers.lesson}\n\n`;
  }

  // Looking ahead
  if (answers.next) {
    email += `**Looking ahead to ${year + 1}:**\n\n${answers.next}\n\n`;
  }

  // Gratitude — the close
  if (answers.gratitude) {
    email += `${answers.gratitude}\n\n`;
  } else {
    email += `Thank you for listening, for sharing, for reaching out. You're the reason this keeps going.\n\n`;
  }

  email += `Here's to ${year + 1},\n\n`;
  email += `[Your name]\n`;
  email += `${show}`;

  return email;
}
