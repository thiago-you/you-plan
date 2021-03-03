import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Planning } from './planning';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  private baseUrl: string = 'http://localhost:3001/plannings';

  constructor(private httpClient: HttpClient) {}

  create(planning: Planning): Observable<Planning> {
    return this.httpClient.post<Planning>(this.baseUrl, planning);
  }

  getAll(): Observable<Planning[]> {
    return this.httpClient.get<Planning[]>(this.baseUrl);
  }

  get(id: string): Observable<Planning> {
    return this.httpClient.get<Planning>(`${this.baseUrl}/${id}`);
  }
  
  update(planning: Planning): Observable<Planning> {
    return this.httpClient.put<Planning>(`${this.baseUrl}/${planning.id}`, planning);
  }
  
  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}