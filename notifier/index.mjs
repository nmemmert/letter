import cron from "node-cron";

const NTFY_URL      = process.env.NTFY_URL      || "https://ntfy.sh";
const NTFY_TOPIC    = process.env.NTFY_TOPIC;
const NTFY_PRIORITY = process.env.NTFY_PRIORITY  || "default";
const NTFY_TOKEN    = process.env.NTFY_TOKEN;     // Bearer token for private topics
const CRON_SCHEDULE = process.env.CRON_SCHEDULE  || "0 9 1 * *";
const TZ            = process.env.TZ             || "America/Chicago";
const APP_URL       = process.env.APP_URL        || "http://localhost:8080";

if (!NTFY_TOPIC) {
  console.error("NTFY_TOPIC is required. Set it in your environment or docker-compose.");
  process.exit(1);
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

async function sendReminder() {
  const now = new Date();
  // We fire on the 1st — remind for the month that just ended
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthName = MONTH_NAMES[prevMonth.getMonth()];
  const year = prevMonth.getFullYear();

  const title = `Time to write your ${monthName} letter`;
  const message = `${monthName} ${year} is done. Take 10 minutes to capture the month before it fades. Open your letter app to answer this month's 6 prompts.`;

  try {
    const headers = {
      Title: title,
      Priority: NTFY_PRIORITY,
      Tags: "pencil,calendar",
      Click: APP_URL,
      "Content-Type": "text/plain",
    };
    if (NTFY_TOKEN) headers["Authorization"] = `Bearer ${NTFY_TOKEN}`;

    const res = await fetch(`${NTFY_URL}/${NTFY_TOPIC}`, {
      method: "POST",
      headers,
      body: message,
    });

    if (res.ok) {
      console.log(`[${new Date().toISOString()}] Reminder sent for ${monthName} ${year}`);
    } else {
      console.error(`[${new Date().toISOString()}] ntfy returned ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Failed to send reminder:`, err.message);
  }
}

console.log(`[${new Date().toISOString()}] Notifier started`);
console.log(`  Topic:    ${NTFY_URL}/${NTFY_TOPIC}`);
console.log(`  Priority: ${NTFY_PRIORITY}`);
console.log(`  Auth:     ${NTFY_TOKEN ? "Bearer token set" : "none (public topic)"}`);
console.log(`  Schedule: ${CRON_SCHEDULE} (${TZ})`);
console.log(`  App URL:  ${APP_URL}`);

// Run on schedule
cron.schedule(CRON_SCHEDULE, sendReminder, { timezone: TZ });

// Send a startup test ping in dev mode
if (process.env.NTFY_TEST_ON_START === "true") {
  console.log("Sending test notification on startup...");
  sendReminder();
}
