import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordService } from '../../services/password.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private passwordService : PasswordService , private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
  }

  resetForm = new FormGroup({
    password : new FormControl('',[Validators.required,Validators.minLength(3)])
  })

  onSubmit(){
    const token = this.route.snapshot.queryParams['token']
    this.passwordService.onResetPassword(this.resetForm.value.password!,token).subscribe({
      next:(data:any)=>{
        console.log(data)
        this.router.navigateByUrl('/login')
      },error:(error:Error)=>{
        console.log(error)
      }
    })
  }

}
