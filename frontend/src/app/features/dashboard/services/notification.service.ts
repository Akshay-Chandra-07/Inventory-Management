import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  apiUrl = environment.apiUrl
  constructor(private _http:HttpClient) { }

  getUserNotifications(){
    return this._http.get(`${this.apiUrl}/notifications/get-user-notifications`)
  }

  updateNotificationStatus(id:any){
    return this._http.patch(`${this.apiUrl}/notifications/update-status`,{id})
  }
}
