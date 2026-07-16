import type { DbAdapter } from '../repository/baseRepository';

// @ts-ignore - platform-specific file resolved by Metro
export * from './db.native';

// Ensure getDatabase returns DbAdapter-compatible type for repository usage
import { getDatabase as _getDatabase } from './db.native';

export async function getDatabase(): Promise<DbAdapter> {
  return _getDatabase() as unknown as Promise<DbAdapter>;
}
