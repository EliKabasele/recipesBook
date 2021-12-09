import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IAuthResponseData } from './authResponseData';
import { User } from './user.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_KEY = 'AIzaSyBsyoS_Dfw5ax4GgEqf3XtFAlMQ2h8pepQ';
  signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;
  loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;

  userSubject = new BehaviorSubject<User>(null);
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  //--- Sign Up -Method ---------------------------
  signUp(userEmail: string, userPassword: string) {
    return this.http
      .post<IAuthResponseData>(this.signUpUrl, {
        email: userEmail,
        password: userPassword,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((responseData) =>
          this.extractAuthenticatedUser(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn
          )
        )
      );
  }

  //--- Login -Method ---------------------------
  login(userEmail: string, userPassword: string) {
    return this.http
      .post<IAuthResponseData>(this.loginUrl, {
        email: userEmail,
        password: userPassword,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((responseData) =>
          this.extractAuthenticatedUser(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn
          )
        )
      );
  }

  //--- Logout -Method ---------------------------
  logout() {
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  //--- auto - Login -Method ---------------------------
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.userSubject.next(loadedUser);
      //auto logout the user after <expireIn>-time
      const expirationDate =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDate);
    }
  }

  //--- handle authentication: extract user after signUp/ login -Method --
  private extractAuthenticatedUser(
    userEmail: string,
    userId: string,
    userToken: string,
    expireIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + +expireIn * 1000);
    const user = new User(userEmail, userId, userToken, expirationDate);
    this.userSubject.next(user);
    //auto logout the user after <expireIn>-time
    this.autoLogout(expireIn * 1000);
    //store the user in the local storage
    localStorage.setItem('userData', JSON.stringify(user));
  }

  //--- auto - Logout -Method ---------------------------
  autoLogout(expirationDuration: number) {
    console.log(
      'User will be automatically logout in: ' +
        expirationDuration +
        ' milli sec'
    );
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  //--- Error Handling -Method ---------------------------
  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This Email exists already!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This Email is not found!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This Password is invalid!';
        break;
      case 'USER_DISABLED':
        errorMessage = 'This user is disabled!';
        break;
    }
    return throwError(errorMessage);
  }
}
