import { browser } from '$app/environment';

function loadFromStorage(): Record<string, boolean> {
  if (!browser) return {};
  try {
    const ids: string[] = JSON.parse(localStorage.getItem('savedSessions') ?? '[]');
    return Object.fromEntries(ids.map(id => [id, true]));
  } catch {
    return {};
  }
}

function persist(ids: Record<string, boolean>) {
  localStorage.setItem('savedSessions', JSON.stringify(Object.keys(ids)));
}

let savedIds = $state<Record<string, boolean>>(loadFromStorage());

function toggle(id: string) {
  if (savedIds[id]) {
    delete savedIds[id];
  } else {
    savedIds[id] = true;
  }
  if (browser) persist(savedIds);
}

function isSaved(id: string): boolean {
  return !!savedIds[id];
}

function getIds(): string[] {
  return Object.keys(savedIds);
}

export const savedSessions = {
  get ids() { return savedIds; },
  toggle,
  isSaved,
  getIds
};