import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

/**
 * Generic data access layer for reading/writing tabular data from files.
 * This abstraction allows easy migration to a real database later.
 */
@Injectable()
export class DataAccessService {
  private readonly dataDir: string;
  /** In-memory cache of tables to avoid repeated file reads */
  private tableCache: Map<string, { data: unknown[]; dirty: boolean }> = new Map();

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
  }

  /**
   * Read all records from a CSV file (with caching)
   * @param tableName - Name of the table (CSV filename without extension)
   * @returns Array of parsed records
   */
  public readTable<T>(tableName: string): T[] {
    // Check cache first
    const cached = this.tableCache.get(tableName);
    if (cached) {
      return cached.data as T[];
    }

    const filePath = path.join(this.dataDir, `${tableName}.csv`);

    if (!fs.existsSync(filePath)) {
      console.warn(`Table file not found: ${filePath}`);
      return [];
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      cast: (value, context) => {
        // Auto-cast numeric columns
        const numericColumns = [
          'id', 'salary', 'performance_rating', 'manager_id',
          'employee_id', 'dependents'
        ];
        if (numericColumns.includes(context.column as string)) {
          if (value === '' || value === null) {
            return null;
          }
          const num = Number(value);
          return isNaN(num) ? value : num;
        }
        return value;
      }
    }) as T[];

    // Cache the data
    this.tableCache.set(tableName, { data: records, dirty: false });

    return records;
  }

  /**
   * Read records with pagination support
   * @param tableName - Name of the table
   * @param skip - Number of records to skip
   * @param take - Number of records to return
   * @returns Object with data array and total count
   */
  public readTablePaginated<T>(
    tableName: string,
    skip: number = 0,
    take: number = 100
  ): { data: T[]; total: number } {
    const allRecords = this.readTable<T>(tableName);
    const total = allRecords.length;
    const data = allRecords.slice(skip, skip + take);

    return { data, total };
  }

  /**
   * Update a single record in a table
   * @param tableName - Name of the table
   * @param idField - Field name used as primary key
   * @param id - Value of the primary key
   * @param updates - Partial object with fields to update
   * @returns Updated record or undefined if not found
   */
  public updateRecord<T>(
    tableName: string,
    idField: keyof T,
    id: number,
    updates: Partial<T>
  ): T | undefined {
    const records = this.readTable<T>(tableName);
    const index = records.findIndex(r => (r as Record<string, unknown>)[idField as string] === id);
    
    if (index === -1) {
      return undefined;
    }

    // Apply updates
    const updated = { ...records[index], ...updates };
    records[index] = updated;

    // Mark cache as dirty and update it
    this.tableCache.set(tableName, { data: records, dirty: true });
    
    // Save to file (async in background, but blocking for simplicity)
    this.writeTableToFile(tableName, records);

    return updated;
  }

  /**
   * Write all records to CSV file
   */
  private writeTableToFile<T>(
    tableName: string,
    records: T[]
  ): void {
    if (records.length === 0) return;

    const filePath = path.join(this.dataDir, `${tableName}.csv`);
    
    // Get headers from first record
    const headers = Object.keys(records[0] as object);
    
    // Build CSV content
    const lines: string[] = [headers.join(',')];
    
    for (const record of records) {
      const rec = record as Record<string, unknown>;
      const values = headers.map(header => {
        const value = rec[header];
        if (value === null || value === undefined) {
          return '';
        }
        // Escape values containing commas, quotes, or newlines
        const strValue = String(value);
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      });
      lines.push(values.join(','));
    }

    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    
    // Mark as no longer dirty
    const cached = this.tableCache.get(tableName);
    if (cached) {
      cached.dirty = false;
    }
  }

  /**
   * Invalidate cache for a table (force re-read on next access)
   */
  public invalidateCache(tableName: string): void {
    this.tableCache.delete(tableName);
  }
}
