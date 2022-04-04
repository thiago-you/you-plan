import { environment } from './../../../environments/environment';
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

  private baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = `${environment.url}/plannings`
  }

  create(planning: Planning): Observable<Planning> {
    planning.id = this.randomHash(10);
    return this.httpClient.post<Planning>(this.baseUrl, planning);
  }

  getAll(): Observable<Planning[]> {
    return this.httpClient.get<Planning[]>(this.baseUrl);
  }

  getFromUser(userId: any): Observable<Planning[]> {
    return this.httpClient.get<Planning[]>(`${this.baseUrl}?created_by=${userId}`);
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

  findUser(planningId: string, userId: string): Observable<User[]> {
    if (planningId != null && planningId.length > 0 && userId != null && userId.length > 0) {
      return this.httpClient.get<User[]>(`${this.baseUrl}-users?user_id=${userId}&planning=${planningId}`)
    }

    return this.httpClient.get<User[]>(`${this.baseUrl}-users?user_id=${userId}`);
  }

  createUser(id: string, user: User): Observable<User> {
    const randomId = (Math.random() + 1).toString(36).substring(2);

    const planningUser = {
      "id": randomId,
      "user_id": user.id,
      "planning": id,
      "name": user.name,
      "admin": user.admin,
      "vote": "",
      "icon": ""
    };

    if (user.icon == undefined || user.icon == '' || user.icon == null) {
      if (planningUser.name != null && planningUser.name.toLocaleLowerCase() == 'you') {
        planningUser.icon = '1';
      } else {
        planningUser.icon += Math.floor(Math.random() * (14 - 2 + 1)) + 2;
      }
    } else {
      planningUser.icon = user.icon;
    }

    return this.httpClient.post<User>(`${this.baseUrl}-users`, planningUser);
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.baseUrl}-users/${user.id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}-users/${id}`);
  }

  getAction(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}-actions?planning=${id}`);
  }

  createAction(id: string): Observable<any> {
    const action = {
      "id": null,
      "planning": id,
      "value": ""
    };

    return this.httpClient.post<any>(`${this.baseUrl}-actions`, action);
  }

  setAction(action: any): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}-actions/${action.id}`, action);
  }

  findAction(id: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}-actions?planning=${id}`);
  }

  getItems(id: string): Observable<PlanningItem[]> {
    return this.httpClient.get<PlanningItem[]>(`${this.baseUrl}-items?planning=${id}`);
  }

  createItem(id: string, item: PlanningItem): Observable<void> {
    item.planning = id;

    return this.httpClient.post<void>(`${this.baseUrl}-items`, item);
  }

  uploadItem(id: string, item: PlanningItem): Observable<void> {
    item.id = null;
    item.planning = id;
    
    return this.httpClient.post<void>(`${this.baseUrl}-items`, item);
  }

  updateItem(item: PlanningItem): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}-items/${item.id}`, item);
  }

  deleteItem(itemId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}-items/${itemId}`);
  }

  private randomHash(length: number) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';

    let result = '';

    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }

    return result;
  }
}
