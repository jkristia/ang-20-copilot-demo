/**
 * Employee interface matching the CSV data structure
 */
export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  job_title: string;
  hire_date: string;
  salary: number;
  status: string;
  location: string;
  manager_id: number | null;
  performance_rating: number;
}

/**
 * Generic paginated response for grid data
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
}

/**
 * Query parameters for paginated data requests
 */
export interface PaginatedQuery {
  skip?: number;
  take?: number;
}
