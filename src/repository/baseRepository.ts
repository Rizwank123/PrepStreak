export type EntityRow = Record<string, unknown>;

export interface DbAdapter {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, params?: (string | number | null)[]): Promise<{ insertId?: number; rowsAffected: number }>;
  getAllAsync<T>(sql: string, params?: (string | number | null)[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, params?: (string | number | null)[]): Promise<T | null>;
  closeAsync(): Promise<void>;
}

export async function insertRow<T extends Record<string, unknown>>(
  db: DbAdapter,
  table: string,
  row: T,
): Promise<void> {
  const keys = Object.keys(row);
  const placeholders = keys.map(() => '?').join(', ');
  const values = keys.map((k) => row[k]);
  await db.runAsync(
    `INSERT OR REPLACE INTO ${table} (${keys.join(', ')}) VALUES (${placeholders});`,
    values as (string | number | null)[],
  );
}

export async function selectAll<T>(
  db: DbAdapter,
  table: string,
  orderBy?: string,
): Promise<T[]> {
  const order = orderBy ? ` ORDER BY ${orderBy}` : '';
  return db.getAllAsync<T>(`SELECT * FROM ${table}${order};`);
}

export async function selectById<T>(
  db: DbAdapter,
  table: string,
  id: string,
): Promise<T | null> {
  const result = await db.getFirstAsync<T>(
    `SELECT * FROM ${table} WHERE id = ? LIMIT 1;`,
    [id],
  );
  return result ?? null;
}

export async function selectWhere<T>(
  db: DbAdapter,
  table: string,
  where: string,
  params: (string | number | null)[],
  orderBy?: string,
): Promise<T[]> {
  const order = orderBy ? ` ORDER BY ${orderBy}` : '';
  return db.getAllAsync<T>(
    `SELECT * FROM ${table} WHERE ${where}${order};`,
    params,
  );
}

export async function updateField(
  db: DbAdapter,
  table: string,
  id: string,
  field: string,
  value: string | number | null,
): Promise<void> {
  await db.runAsync(
    `UPDATE ${table} SET ${field} = ?, updated_at = ? WHERE id = ?;`,
    [value, Date.now(), id],
  );
}

export async function deleteById(
  db: DbAdapter,
  table: string,
  id: string,
): Promise<void> {
  await db.runAsync(`DELETE FROM ${table} WHERE id = ?;`, [id]);
}

export async function countRows(
  db: DbAdapter,
  table: string,
  where?: string,
  params?: (string | number | null)[],
): Promise<number> {
  const clause = where ? ` WHERE ${where}` : '';
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM ${table}${clause};`,
    params ?? [],
  );
  return result?.count ?? 0;
}
