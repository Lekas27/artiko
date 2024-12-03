import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:1337/api/auth';

  constructor(private http: HttpClient) {}

  register(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/local/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/local`, credentials);
  }
  logout(): void {
    localStorage.removeItem('jwt');
    console.log('User logged out successfully.');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }

  getCurrentUserId(): string | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Fetched user from localStorage:', user);
    return user?.id || null;
  }
  
}
