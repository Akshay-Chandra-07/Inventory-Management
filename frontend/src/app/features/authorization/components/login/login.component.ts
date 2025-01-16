import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  destroy$ = new Subject<void>();
  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onLoginSubmit() {
    this.loginService
      .loginUser(
        this.loginForm.controls.email.value!,
        this.loginForm.controls.password.value!,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          sessionStorage.setItem('accesstoken', data.accessToken!);
          sessionStorage.setItem('refreshtoken', data.refreshToken!);
          this.router.navigateByUrl('/dashboard/home');
        },
        error(error) {},
      });
  }
}
