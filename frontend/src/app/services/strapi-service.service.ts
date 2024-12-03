import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StrapiServiceService {
  private apiUrl = 'http://localhost:1337/api/posts';  // URL do tvog Strapi API-a

  constructor(private http: HttpClient) {}

  // Metoda za dobijanje svih postova, uključujući slike i korisnike
  getAllPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}?populate=*`);  // 'populate=*' učitava slike i korisnike
  }

  searchUsers(query: string) {
    const url = `http://localhost:1337/api/users?filters[username][$contains]=${query}`;
    return this.http.get<any[]>(url);
  }
  getUserById(id: string) {
    const url = `http://localhost:1337/api/users/${id}`;
    return this.http.get<any>(url);
  }
  
}
