import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Observable,
  of,
  map,
  EMPTY,
  catchError,
  mergeMap,
  filter,
  toArray,
} from 'rxjs';
import { environment } from '@dg-environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@dg-core/types/models/daos/auth.daos';
import { User } from '@dg-core/types/models/user';
import { AbstractAuthService } from './abstract-auth.service';
import { AdminRequestForApproval } from '@dg-core/types/models/admin-request-for-approval';
import { Router } from '@angular/router';
import { AdminRequestForApprovalGetDao } from '@dg-core/types/models/daos/admin-request-for-approval.daos';

/**
 * Сервис для аутентификации пользователя.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService extends AbstractAuthService {
  private readonly router = inject(Router);

  /**
   * Ключ в local storage для данных пользователя.
   */
  readonly #USER_STORAGE_KEY = 'user';

  #currentUser: User | null = null;

  get currentUser(): User | null {
    return this.#currentUser;
  }

  set currentUser(value: User | null) {
    this.#currentUser = value;
    this.storeUser();
  }

  get isAuthenticated(): boolean {
    return this.#currentUser != null;
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/v1/auth/authenticate`;

    const loginObservable = this.http.post<LoginResponse>(url, request, {
      observe: 'response',
    });

    return loginObservable.pipe(
      catchError((res) => of(res)),
      map((res) => {
        switch (res.status) {
          case 200:
            this.currentUser = {
              username: request.username,
              token: res.body!.token,
              accountType: res.body!.role,
            };
            break;
          case 403:
            throw new Error('Wrong username or password');
          default:
            throw new Error('Login error');
        }

        return res.body!;
      })
    );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    const url = `${environment.apiUrl}/v1/auth/register`;

    const registerObservable = this.http.post<RegisterResponse>(url, request, {
      observe: 'response',
    });

    return registerObservable.pipe(
      catchError((res) => of(res)),
      map((res) => {
        switch (res.status) {
          case 200:
            this.currentUser = {
              username: request.username,
              token: res.body!.token,
              accountType: res.body!.role,
            };
            break;
          case 409:
            throw new Error('User already exists');
          default:
            throw new Error('Register error');
        }

        return res.body!;
      })
    );
  }

  logout(): Observable<unknown> {
    localStorage.removeItem(this.#USER_STORAGE_KEY);

    return EMPTY;
  }

  authViaToken(): Observable<boolean> {
    const user = this.restoreUser();

    if (user == undefined || user.token == undefined) {
      return of(false);
    }

    const url = `${environment.apiUrl}/v1/auth/verify-token`;
    const checkTokenObservable = this.http.get(url, {
      headers: this.getAuthHeaders(user),
      responseType: 'text',
    });

    return checkTokenObservable.pipe(
      map(() => {
        this.currentUser = user;

        return true;
      }),
      catchError(() => {
        this.currentUser = null;

        return of(false);
      })
    );
  }

  requestAdminRights(): Observable<void> {
    const url = `${environment.apiUrl}/admin-request/request`;

    return this.http
      .post(url, null, {
        headers: this.getAuthHeaders(this.currentUser),
        observe: 'response',
      })
      .pipe(
        catchError((res) => of(res)),
        map((res) => {
          switch (res.status) {
            case 201:
              return;
            case 400:
              throw new Error('Request already exists');
            default:
              throw new Error('Unknown error');
          }
        })
      );
  }

  override getAdminRequestsForApproval$(): Observable<
    AdminRequestForApproval[]
  > {
    const url = `${environment.apiUrl}/admin-request/all`;

    return this.http
      .get<AdminRequestForApprovalGetDao[]>(url, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        mergeMap((requests) => requests),
        filter((request) => !request.approved),
        toArray()
      );
  }

  approveAdminRequest$(request: AdminRequestForApproval): Observable<void> {
    const url = `${environment.apiUrl}/admin-request/${request.id}/approve`;

    return (
      this.http
        .post(url, null, {
          headers: this.getAuthHeaders(),
          responseType: 'text',
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .pipe(map(() => {}))
    );
  }

  redirectAfterAuth(): void {
    void this.router.navigate(['/home']);
  }

  getAuthHeaders(
    user: User | null | 'current-user' = 'current-user'
  ): HttpHeaders {
    if (user === 'current-user') {
      user = this.currentUser;
    }

    let headers = new HttpHeaders();
    if (user && user.token) {
      headers = headers.set('Authorization', `Bearer ${user.token}`);
    }

    return headers;
  }

  /**
   * Восстановить сохранённые данные пользователя.
   *
   * @returns данные пользователя или `null`, если они не были сохранены
   */
  private restoreUser(): User | null {
    const storedUserCredentials = localStorage.getItem(this.#USER_STORAGE_KEY);

    return storedUserCredentials ? JSON.parse(storedUserCredentials) : null;
  }

  /**
   * Сохранить данные пользователя.
   */
  private storeUser(): void {
    if (this.#currentUser === null) {
      localStorage.removeItem(this.#USER_STORAGE_KEY);
      return;
    }

    const userJson = JSON.stringify(this.#currentUser);
    localStorage.setItem(this.#USER_STORAGE_KEY, userJson);
  }
}
