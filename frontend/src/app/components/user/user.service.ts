import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = `${environment.url}/users`
  }

  create(user: User): Observable<User> {
    user.id = (Math.random() + 1).toString(36).substring(2);

    return this.httpClient.post<User>(this.baseUrl, user);
  }

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseUrl);
  }

  get(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/${id}`);
  }
  
  update(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.baseUrl}/${user.id}`, user);
  }
  
  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  find(name: String): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}?name=${name}`);
  }
}
