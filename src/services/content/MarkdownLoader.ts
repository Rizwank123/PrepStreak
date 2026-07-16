const store = new Map<string, string>();

export function registerMarkdown(key: string, md: string): void {
  store.set(key, md);
}

export function loadMarkdown(key: string): string {
  return store.get(key) ?? '';
}
