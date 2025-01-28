import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  apiUrl = environment.apiUrl
  constructor(private _http : HttpClient) { }

  onForgotPassword(email:string){
    return this._http.post(`${this.apiUrl}/auth/forgot-password`,{email})
  }

  onResetPassword(password:string,token:string){
    return this._http.post(`${this.apiUrl}/auth/reset-password`,{password,token})
  }
}
