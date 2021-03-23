import { PlanningItem } from './planningItem';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user/user';
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
    return this.httpClient.get<Planning>(`${this.baseUrl}/${id}?embed`);
  }
  
  update(planning: Planning): Observable<Planning> {
    return this.httpClient.put<Planning>(`${this.baseUrl}/${planning.id}`, planning);
  }
  
  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  getUsers(id: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}-users?planning=${id}`);
  }

  createUser(id: string, user: User): Observable<void> {
    user.planning = id;

    return this.httpClient.post<void>(`${this.baseUrl}-users`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.baseUrl}-users/${user.id}`, user);
  }

  deleteUser(id: Number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}-users/${id}`);
  }

  getAction(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}-actions?planning=${id}`);
  }

  setAction(action: any): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}-actions/${action.id}`, action);
  }

  getItems(id: string): Observable<PlanningItem[]> {
    return this.httpClient.get<PlanningItem[]>(`${this.baseUrl}-items?planning=${id}`);
  }

  createItem(id: string, item: PlanningItem): Observable<void> {
    item.planning = id;

    return this.httpClient.post<void>(`${this.baseUrl}-items`, item);
  }

  updateItem(item: PlanningItem): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}-items/${item.id}`, item);
  }

  deleteItem(itemId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}-items/${itemId}`);
  }
}
