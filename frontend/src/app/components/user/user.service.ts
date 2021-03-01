import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = 'http://localhost:3001/users';

  constructor(private httpClient: HttpClient) {}

  create(user: User): Observable<User> {
    return this.httpClient.post<User>(this.baseUrl, user);
  }

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseUrl);
  }

  get(id: Number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/${id}`);
  }
  
  update(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.baseUrl}/${user.id}`, user);
  }
  
  delete(id: Number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
