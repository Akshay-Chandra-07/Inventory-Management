import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private passwordService:PasswordService ) { }

  ngOnInit(): void {
  }

  forgotForm = new FormGroup({
    email : new FormControl('',[Validators.required,Validators.email])
  })

  onSubmit(){
    this.passwordService.onForgotPassword(this.forgotForm.value.email!).subscribe({
      next:(data:any)=>{
        console.log("email sent")
      },error:(error:Error)=>{
        console.log("error")
      }
    })
  }
}
