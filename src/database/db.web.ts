export interface SqlResult {
  insertId?: number;
  rowsAffected: number;
}

export interface SqlRow {
  [key: string]: unknown;
}

export interface SqlResultSet {
  rows: { length: number; item: (index: number) => SqlRow; _array: SqlRow[] };
  insertId?: number;
  rowsAffected: number;
}

interface SqliteDatabase {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, params?: (string | number | null)[]): Promise<SqlResult>;
  getAllAsync<T>(sql: string, params?: (string | number | null)[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, params?: (string | number | null)[]): Promise<T | null>;
  closeAsync(): Promise<void>;
}

type Row = Record<string, unknown>;

class WebDatabase implements SqliteDatabase {
  tables: Map<string, Row[]> = new Map();
  schemas: Map<string, string[]> = new Map();

  private parseCreate(sql: string): { table: string; columns: string[] } | null {
    const match = sql.match(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+(\w+)\s*\(([\s\S]*?)\);/i);
    if (!match) return null;
    const table = match[1];
    const colsPart = match[2];
    const columns: string[] = [];
    const lines = colsPart.split(',').map((l) => l.trim());
    for (const line of lines) {
      if (line.toUpperCase().startsWith('FOREIGN KEY')) continue;
      if (line.toUpperCase().startsWith('UNIQUE')) continue;
      if (line.toUpperCase().startsWith('CHECK')) continue;
      if (line.toUpperCase().startsWith('PRIMARY KEY')) continue;
      if (line.toUpperCase().startsWith('CONSTRAINT')) continue;
      const colMatch = line.match(/^(\w+)\s/);
      if (colMatch) {
        columns.push(colMatch[1]);
      }
    }
    return { table, columns };
  }

  private ensureTable(table: string): Row[] {
    if (!this.tables.has(table)) {
      this.tables.set(table, []);
      if (!this.schemas.has(table)) {
        this.schemas.set(table, []);
      }
    }
    return this.tables.get(table)!;
  }

  async execAsync(sql: string): Promise<void> {
    const statements = sql.split(';').map((s) => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      if (stmt.toUpperCase().startsWith('CREATE TABLE')) {
        const parsed = this.parseCreate(stmt + ';');
        if (parsed) {
          this.ensureTable(parsed.table);
          this.schemas.set(parsed.table, parsed.columns);
        }
      } else if (stmt.toUpperCase().startsWith('CREATE INDEX')) {
        // no-op for in-memory
      }
    }
  }

  private resolveValue(val: unknown): string | number | null {
    if (val === null || val === undefined) return null;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return val;
    return String(val);
  }

  async runAsync(sql: string, params: (string | number | null)[] = []): Promise<SqlResult> {
    const trimmed = sql.trim();

    if (trimmed.toUpperCase().startsWith('INSERT OR REPLACE')) {
      const match = trimmed.match(/INSERT\s+OR\s+REPLACE\s+INTO\s+(\w+)\s*\(([^)]*)\)\s*VALUES\s*\(([^)]*)\)/i);
      if (match) {
        const table = match[1];
        const cols = match[2].split(',').map((c) => c.trim());
        const rows = this.ensureTable(table);
        const idIndex = cols.indexOf('id');
        const idVal = idIndex >= 0 ? String(params[idIndex]) : undefined;

        const existingIdx = idVal !== undefined
          ? rows.findIndex((r) => String(r['id']) === idVal)
          : -1;

        const row: Row = {};
        cols.forEach((col, i) => {
          row[col] = this.resolveValue(params[i]);
        });

        if (existingIdx >= 0) {
          rows[existingIdx] = row;
        } else {
          rows.push(row);
        }
        return { rowsAffected: 1 };
      }
    }

    if (trimmed.toUpperCase().startsWith('INSERT')) {
      const match = trimmed.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]*)\)\s*VALUES\s*\(([^)]*)\)/i);
      if (match) {
        const table = match[1];
        const cols = match[2].split(',').map((c) => c.trim());
        const rows = this.ensureTable(table);
        const row: Row = {};
        cols.forEach((col, i) => {
          row[col] = this.resolveValue(params[i]);
        });
        rows.push(row);
        return { rowsAffected: 1 };
      }
    }

    if (trimmed.toUpperCase().startsWith('UPDATE')) {
      const match = trimmed.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(.+?)(?:;|$)/i);
      if (match) {
        const table = match[1];
        const setClause = match[2];
        const whereClause = match[3];
        const rows = this.ensureTable(table);

        const setParts = setClause.split(',').map((s) => s.trim());
        const setOps: { col: string; paramIdx: number }[] = [];
        let paramCursor = 0;

        for (const part of setOps.length ? [] : setParts) {
          const m = part.match(/(\w+)\s*=\s*\?/);
          if (m) {
            setOps.push({ col: m[1], paramIdx: paramCursor++ });
          }
        }

        // Parse SET clauses with their param positions
        const allSetMatches: { col: string; idx: number }[] = [];
        let setParamIdx = 0;
        for (const part of setParts) {
          const m = part.match(/(\w+)\s*=\s*\?/);
          if (m) {
            allSetMatches.push({ col: m[1], idx: setParamIdx++ });
          }
        }

        // Parse WHERE clause params
        const whereParams = params.slice(setParamIdx);
        const whereResult = this.evaluateWhere(whereClause, whereParams);

        let affected = 0;
        for (const row of rows) {
          if (whereResult.matches(row)) {
            for (const sm of allSetMatches) {
              row[sm.col] = params[sm.idx];
            }
            affected++;
          }
        }
        return { rowsAffected: affected };
      }
    }

    if (trimmed.toUpperCase().startsWith('DELETE')) {
      const match = trimmed.match(/DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:;|$)/i);
      if (match) {
        const table = match[1];
        const whereClause = match[2];
        const rows = this.ensureTable(table);

        if (!whereClause) {
          const count = rows.length;
          rows.length = 0;
          return { rowsAffected: count };
        }

        const whereResult = this.evaluateWhere(whereClause, params);
        let affected = 0;
        for (let i = rows.length - 1; i >= 0; i--) {
          if (whereResult.matches(rows[i])) {
            rows.splice(i, 1);
            affected++;
          }
        }
        return { rowsAffected: affected };
      }
    }

    return { rowsAffected: 0 };
  }

  async getAllAsync<T>(sql: string, params: (string | number | null)[] = []): Promise<T[]> {
    const trimmed = sql.trim();

    if (trimmed.toUpperCase().startsWith('SELECT')) {
      const result = this.executeSelect(trimmed, params);
      return result as T[];
    }

    return [];
  }

  async getFirstAsync<T>(sql: string, params: (string | number | null)[] = []): Promise<T | null> {
    const trimmed = sql.trim();
    if (trimmed.toUpperCase().startsWith('SELECT')) {
      const result = this.executeSelect(trimmed, params);
      return (result[0] as T) ?? null;
    }
    return null;
  }

  private executeSelect(sql: string, params: (string | number | null)[]): Row[] {
    const match = sql.match(/SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?(?:;|$)/i);
    if (!match) return [];

    const cols = match[1];
    const table = match[2];
    const whereClause = match[3];
    const orderBy = match[4];
    const limit = match[5];

    let rows = this.ensureTable(table);

    if (whereClause) {
      const whereResult = this.evaluateWhere(whereClause, params);
      rows = rows.filter((r) => whereResult.matches(r));
    }

    if (orderBy) {
      const orderParts = orderBy.split(',').map((o) => o.trim());
      rows = [...rows].sort((a, b) => {
        for (const part of orderParts) {
          const [col, dir] = part.split(/\s+/);
          const aVal = a[col];
          const bVal = b[col];
          let cmp = 0;
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            cmp = aVal - bVal;
          } else {
            cmp = String(aVal).localeCompare(String(bVal));
          }
          if (dir && dir.toUpperCase() === 'DESC') cmp = -cmp;
          if (cmp !== 0) return cmp;
        }
        return 0;
      });
    }

    if (limit) {
      rows = rows.slice(0, parseInt(limit, 10));
    }

    if (cols === '*') {
      return rows.map((r) => ({ ...r }));
    }

    const colNames = cols.split(',').map((c) => c.trim());
    return rows.map((r) => {
      const result: Row = {};
      for (const col of colNames) {
        result[col] = r[col];
      }
      return result;
    });
  }

  private evaluateWhere(clause: string, params: (string | number | null)[]): { matches: (row: Row) => boolean } {
    const conditions: ((row: Row) => boolean)[] = [];
    let paramIdx = 0;

    const parts = clause.split(/\s+AND\s+/i);

    for (const part of parts) {
      const trimmed = part.trim();

      // col = ?
      let m = trimmed.match(/^(\w+)\s*=\s*\?$/);
      if (m) {
        const col = m[1];
        const val = params[paramIdx++];
        conditions.push((row) => String(row[col]) === String(val));
        continue;
      }

      // col LIKE ?
      m = trimmed.match(/^(\w+)\s+LIKE\s+\?$/i);
      if (m) {
        const col = m[1];
        const pattern = String(params[paramIdx++]);
        const regex = new RegExp(pattern.replace(/%/g, '.*').replace(/_/g, '.'), 'i');
        conditions.push((row) => regex.test(String(row[col] ?? '')));
        continue;
      }

      // col > ? or col >= ?
      m = trimmed.match(/^(\w+)\s*>=\s*\?$/);
      if (m) {
        const col = m[1];
        const val = params[paramIdx++];
        conditions.push((row) => Number(row[col]) >= Number(val));
        continue;
      }

      m = trimmed.match(/^(\w+)\s*<=\s*\?$/);
      if (m) {
        const col = m[1];
        const val = params[paramIdx++];
        conditions.push((row) => Number(row[col]) <= Number(val));
        continue;
      }

      m = trimmed.match(/^(\w+)\s*>\s*\?$/);
      if (m) {
        const col = m[1];
        const val = params[paramIdx++];
        conditions.push((row) => Number(row[col]) > Number(val));
        continue;
      }

      m = trimmed.match(/^(\w+)\s*<\s*\?$/);
      if (m) {
        const col = m[1];
        const val = params[paramIdx++];
        conditions.push((row) => Number(row[col]) < Number(val));
        continue;
      }

      // col = value (literal)
      m = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
      if (m) {
        const col = m[1];
        let val: string = m[2].replace(/^['"]|['"]$/g, '');
        conditions.push((row) => String(row[col]) === val);
        continue;
      }

      // COALESCE(SUM(col), 0) as total — skip, this is for aggregate queries
      m = trimmed.match(/^COALESCE/i);
      if (m) {
        conditions.push(() => true);
        continue;
      }

      // col IS NULL
      m = trimmed.match(/^(\w+)\s+IS\s+NULL$/i);
      if (m) {
        const col = m[1];
        conditions.push((row) => row[col] == null);
        continue;
      }

      // col IS NOT NULL
      m = trimmed.match(/^(\w+)\s+IS\s+NOT\s+NULL$/i);
      if (m) {
        const col = m[1];
        conditions.push((row) => row[col] != null);
        continue;
      }

      // Fallback: always true
      conditions.push(() => true);
    }

    return {
      matches: (row: Row) => conditions.every((c) => c(row)),
    };
  }

  async closeAsync(): Promise<void> {
    // no-op
  }
}

let dbInstance: WebDatabase | null = null;

export async function getDatabase(): Promise<SqliteDatabase> {
  if (dbInstance) return dbInstance;
  dbInstance = new WebDatabase();
  const { SCHEMA_SQL } = await import('./schema/schema');
  await dbInstance.execAsync(SCHEMA_SQL);
  // content_path migration — no-op for web in-memory DB (schema handles it)
  try {
    await dbInstance.execAsync(`ALTER TABLE topics ADD COLUMN content_path TEXT NOT NULL DEFAULT '';`);
  } catch { /* already exists */ }
  return dbInstance;
}

export async function resetDatabase(): Promise<void> {
  if (dbInstance) {
    dbInstance.tables.clear();
    dbInstance.schemas.clear();
  }
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    dbInstance = null;
  }
}

export type SQLiteDatabase = SqliteDatabase;
