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
 * Employee detail interface for master-detail view
 * Contains personal information linked by employee_id
 */
export interface EmployeeDetail {
  employee_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  dependents: number;
  nationality: string;
  ssn: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  home_phone: string;
  mobile_phone: string;
  work_phone: string;
  work_extension: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  bank_name: string;
  bank_account: string;
  routing_number: string;
  tax_id: string;
  drivers_license: string;
  drivers_license_state: string;
  blood_type: string;
  medical_conditions: string;
  allergies: string;
  dietary_restrictions: string;
  shirt_size: string;
  notes: string;
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

/**
 * DTO for updating an employee detail record
 */
export interface UpdateEmployeeDetailDto {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  dependents?: number;
  nationality?: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  mobile_phone?: string;
  work_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  bank_name?: string;
  blood_type?: string;
  medical_conditions?: string;
  allergies?: string;
  dietary_restrictions?: string;
  shirt_size?: string;
  notes?: string;
}
