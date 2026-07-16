import type { TopicContent, ContentCategory } from '../../content/types';
import { getStored, setStored } from '../../storage/mmkv';

const CACHE_PREFIX = 'cc_';
const CACHE_VERSION = 'v2';
const CACHE_TTL = 60 * 60 * 1000;

interface CacheEntry { data: TopicContent; ts: number }

function cacheKey(key: string): string {
  return CACHE_PREFIX + CACHE_VERSION + '_' + key;
}

function fromCache(key: string): TopicContent | null {
  const e = getStored<CacheEntry | null>(cacheKey(key), null);
  if (!e || Date.now() - e.ts > CACHE_TTL) return null;
  return e.data;
}

function toCache(key: string, data: TopicContent): void {
  setStored<CacheEntry>(cacheKey(key), { data, ts: Date.now() });
}

const registry = new Map<string, () => Promise<TopicContent>>();

export function registerContent(slug: string, loader: () => Promise<TopicContent>): void {
  registry.set(slug, loader);
}

export async function loadTopicContent(slug: string): Promise<TopicContent | null> {
  const cached = fromCache(slug);
  if (cached) return cached;
  const loader = registry.get(slug);
  if (!loader) return null;
  const content = await loader();
  toCache(slug, content);
  return content;
}

export function getRegisteredSlugs(category?: ContentCategory): string[] {
  const all = Array.from(registry.keys());
  return category ? all.filter((s) => s.startsWith(category + '/')) : all;
}

export function isRegistered(slug: string): boolean {
  return registry.has(slug);
}
