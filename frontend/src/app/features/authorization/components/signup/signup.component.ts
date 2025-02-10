import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  
  rolesAvailable:any | undefined;
  constructor(
    private router: Router,
    private signupService: SignupService,
    private toast: NgToastService,
  ) {
    this.rolesAvailable = {
      Admin:"3",
      Manager:"2",
      User:"1"
    }
  }

  ngOnInit(): void {
    sessionStorage.clear();
  }

  signUpForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    role: new FormControl(''),
    password: new FormControl(''),
    location : new FormControl('')
  });

  onSignUpSubmit() {
    this.signupService
      .registerUser(
        this.signUpForm.controls.firstName.value!,
        this.signUpForm.controls.lastName.value!,
        this.signUpForm.controls.email.value!,
        this.rolesAvailable![this.signUpForm.controls.role.value!],
        this.signUpForm.controls.password.value!,
        this.signUpForm.controls.location.value!
      )
      .pipe()
      .subscribe({
        next: (data: any) => {
          this.toast.success({ detail: data.msg, duration: 2000 });
          this.router.navigateByUrl('/auth/login');
        },
        error: (error) => {
          this.toast.error({ detail: error.error.msg, duration: 2000 });
        },
      });
  }
}
