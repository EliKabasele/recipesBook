import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IAuthResponseData } from './authResponseData';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const userEmail = form.value.email;
    const userPassword = form.value.password;

    let authObservable_: Observable<IAuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObservable_ = this.authService.login(userEmail, userPassword);
    } else {
      authObservable_ = this.authService.signUp(userEmail, userPassword);
    }

    authObservable_.subscribe(
      (responseData) => {
        console.log(responseData);
        this.isLoading = false;
        this.error = null;
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
