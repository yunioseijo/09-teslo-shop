import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@environments/environment';
import { tap } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  private httpService = inject(HttpClient);

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

  login(email: string, password: string) {
    return this.httpService.post<AuthResponse>(`${baseUrl}/auth/login`,
      { email, password }).pipe(
        tap( resp => {
          this._authStatus.set('authenticated');
          this._token.set(resp.token);
          this._user.set(resp.user);

          localStorage.setItem('token', resp.token);

        })
       )
    }

}
