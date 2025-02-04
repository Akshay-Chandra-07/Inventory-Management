import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  apiUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {}
  registerUser(
    first_name: string,
    last_name: string,
    email: string,
    role: string,
    password: string,
  ) {
    return this._http.post(`${this.apiUrl}/auth/signup`, {
      first_name,
      last_name,
      email,
      role,
      password,
    });
  }
}
