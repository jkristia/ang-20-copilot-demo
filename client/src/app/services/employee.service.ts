import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, EmployeeDetail, PaginatedResponse, PaginatedQuery, UpdateEmployeeDetailDto } from '@blog/shared';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/employees';

  public getEmployees(query: PaginatedQuery = {}): Observable<PaginatedResponse<Employee>> {
    let params = new HttpParams();
    
    if (query.skip !== undefined) {
      params = params.set('skip', query.skip.toString());
    }
    if (query.take !== undefined) {
      params = params.set('take', query.take.toString());
    }

    return this.http.get<PaginatedResponse<Employee>>(this.apiUrl, { params });
  }

  public getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  public getEmployeeDetails(query: PaginatedQuery = {}): Observable<PaginatedResponse<EmployeeDetail>> {
    let params = new HttpParams();
    
    if (query.skip !== undefined) {
      params = params.set('skip', query.skip.toString());
    }
    if (query.take !== undefined) {
      params = params.set('take', query.take.toString());
    }

    return this.http.get<PaginatedResponse<EmployeeDetail>>(`${this.apiUrl}/details`, { params });
  }

  public getEmployeeDetail(employeeId: number): Observable<EmployeeDetail> {
    return this.http.get<EmployeeDetail>(`${this.apiUrl}/${employeeId}/details`);
  }

  public updateEmployeeDetail(employeeId: number, updates: UpdateEmployeeDetailDto): Observable<EmployeeDetail> {
    return this.http.patch<EmployeeDetail>(`${this.apiUrl}/${employeeId}/details`, updates);
  }
}
