import type { Resource } from '../../content/types';

const store = new Map<string, Resource[]>();

export function registerResources(slug: string, resources: Resource[]): void {
  store.set(slug, resources);
}

export function loadResources(slug: string): Resource[] {
  return store.get(slug) ?? [];
}
