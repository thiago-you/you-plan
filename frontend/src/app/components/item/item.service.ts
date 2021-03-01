import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from './item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private baseUrl: string = 'http://localhost:3001/items';

  constructor(private httpClient: HttpClient) {}

  create(item: Item): Observable<Item> {
    return this.httpClient.post<Item>(this.baseUrl, item);
  }

  getAll(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.baseUrl);
  }

  get(id: Number): Observable<Item> {
    return this.httpClient.get<Item>(`${this.baseUrl}/${id}`);
  }
  
  update(item: Item): Observable<Item> {
    return this.httpClient.put<Item>(`${this.baseUrl}/${item.id}`, item);
  }
  
  delete(id: Number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
