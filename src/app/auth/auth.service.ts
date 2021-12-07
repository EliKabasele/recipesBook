import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
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

  userSubject = new Subject<User>();

  constructor(private http: HttpClient) {}

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
            responseData.expiresIn
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
            responseData.expiresIn
          )
        )
      );
  }

  private extractAuthenticatedUser(
    userEmail: string,
    userId: string,
    userToken: string,
    expireIn: string
  ) {
    const expirationDate = new Date(new Date().getTime() + +expireIn * 1000);
    const user = new User(userEmail, userId, userToken, expirationDate);
    this.userSubject.next(user);
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
