interface StorageLike {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  remove(key: string): void;
  clearAll(): void;
}

const localStorageStorage: StorageLike = {
  getString(key: string) {
    try {
      return localStorage.getItem(key) ?? undefined;
    } catch {
      return undefined;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
  clearAll() {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  },
};

export const storage = localStorageStorage;

export function getStored<T>(key: string, fallback: T): T {
  try {
    const value = storage.getString(key);
    if (value == null) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function setStored<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

export function removeStored(key: string): void {
  storage.remove(key);
}

export function clearAllStorage(): void {
  storage.clearAll();
}
