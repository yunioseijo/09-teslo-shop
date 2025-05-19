import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private httpService = inject(HttpClient);

  checkStatus = rxResource({
    loader: () => this.checkAuthStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') {
      return 'checking';
    }
    if (this._user()) {
      return 'authenticated';
    }
    return 'not-authenticated';
  });

  user = computed(() =>  this._user());
  token = computed(this._token);
  isAdmin = computed(() => this.user()?.roles.includes('admin') ?? false);

  login(email: string, password: string):Observable<boolean> {
    return this.httpService.post<AuthResponse>(`${baseUrl}/auth/login`,
      { email, password }).pipe(
        tap( resp => this.handleAuthSuccess(resp)),
        // tap( () => console.log(this._user()?.roles)),
        map( () => true),
        catchError( (error) => this.handleAuthError()),
       )
    }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if(!token){
      this.logout();
      return of(false);
    }
    // TODO: Create cache and call the endpoint if needed
    return this.httpService.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
      headers: {
        // added in the interceptor
        // 'Authorization': `Bearer ${token}`
      },
    }).pipe(
      tap( resp => this.handleAuthSuccess(resp)),
        map( () => true),
        catchError( (error) => this.handleAuthError()),
       )
  }

  //Logout
  logout() {
    this._user.set(null);
    this._authStatus.set('not-authenticated');
    this._token.set(null);
    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ token ,user}: AuthResponse) {
    this._authStatus.set('authenticated');
    this._token.set(token);
    this._user.set(user);

    localStorage.setItem('token', token);
  }

  private handleAuthError() {
    this.logout();
    return of(false);
  }
  //Register
  register(email: string, password: string, fullName: string):Observable<boolean> {
    return this.httpService.post<AuthResponse>(`${baseUrl}/auth/register`, { email, password, fullName }).pipe(
        tap( resp => this.handleAuthSuccess(resp)),
        map( () => true),
        catchError( (error) => this.handleAuthError()),
       )
    }


}
