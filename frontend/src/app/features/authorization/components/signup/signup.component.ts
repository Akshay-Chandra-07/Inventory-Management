import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(
    private router: Router,
    private signupService: SignupService,
  ) {}

  ngOnInit(): void {}

  signUpForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSignUpSubmit() {
    console.log(
      this.signUpForm.controls.firstName.value!,
      this.signUpForm.controls.lastName.value!,
      this.signUpForm.controls.email.value!,
      this.signUpForm.controls.password.value!,
    );

    this.signupService
      .registerUser(
        this.signUpForm.controls.firstName.value!,
        this.signUpForm.controls.lastName.value!,
        this.signUpForm.controls.email.value!,
        this.signUpForm.controls.password.value!,
      )
      .pipe()
      .subscribe({
        next: (data: any) => {
          console.log(data.msg);
          this.router.navigateByUrl('/auth/login');
        },
        error(error) {
          console.log(error);
        },
      });
    console.log(this.signUpForm);
  }
}
