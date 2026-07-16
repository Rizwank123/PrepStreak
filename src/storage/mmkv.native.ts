import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'prepstreak-storage' });

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
