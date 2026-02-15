import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

/**
 * Generic data access layer for reading tabular data from files.
 * This abstraction allows easy migration to a real database later.
 */
@Injectable()
export class DataAccessService {
  private readonly dataDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
  }

  /**
   * Read all records from a CSV file
   * @param tableName - Name of the table (CSV filename without extension)
   * @returns Array of parsed records
   */
  public readTable<T>(tableName: string): T[] {
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
}
