import fallbackSchedule from '$lib/data/schedule.json';

const REMOTE_URL = 'https://ire-nicar-conference-schedules.s3.us-east-2.amazonaws.com/nicar-2026/nicar-2026-schedule.json';
const TIMEOUT_MS = 5000;

export async function fetchSchedule() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(REMOTE_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return await response.json();
  } catch (err) {
    console.warn('Remote schedule fetch failed, using local fallback:', err);
    return fallbackSchedule;
  }
}