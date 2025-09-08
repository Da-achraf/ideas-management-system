import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/http-client';
import { map, Observable, of } from 'rxjs';
import { LoginUser, RegisterUser, User } from '../auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiService = inject(ApiService);

  register(credentials: RegisterUser): Observable<User & { token: string }> {
    return this.apiService
      .post<User, RegisterUser>('/auth/register', credentials)
      .pipe(map((resp) => resp as User & { token: string }));
  }

  login(body: LoginUser): Observable<User & { token: string }> {
    return this.apiService
      .post<User, LoginUser>('/auth/login', body)
      .pipe(map((resp) => resp as User & { token: string }));
  }

  // Get user alongside with jwt token
  getUser(id: string) {
    return this.apiService
      .get<User & { token: string }>('/auth/user/:id', {
        pathParams: { id },
      })
      .pipe(map((resp) => resp as User & { token: string }));
  }

  logout() {
    return of(null);
    throw new Error('Logout not implemented');
  }
}
