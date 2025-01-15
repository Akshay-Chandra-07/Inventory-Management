import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl = environment.apiUrl
  constructor(private _http:HttpClient) {}

  loginUser(user:string,password:string){
    return this._http.post(`${this.apiUrl}/auth/login`,{user,password})
  }
}
