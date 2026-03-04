import { fetchSchedule } from '$lib/server/schedule';

export async function load() {
  const schedule = await fetchSchedule();
  return { schedule };
}