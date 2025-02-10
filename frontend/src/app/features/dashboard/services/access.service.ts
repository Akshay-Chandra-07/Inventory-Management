import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  apiUrl = environment.apiUrl
  constructor(
    private _http:HttpClient
  ) { }

  getAllUsersFromLocation(){
    return this._http.get(`${this.apiUrl}/users/get-all-users-from-location`)
  }

  removeUserFeature(feature_id:number,user_id:number){
    return this._http.delete(`${this.apiUrl}/users/remove-user-feature?featureId=${feature_id}&userId=${user_id}`)
  }
  
  addUserFeature(feature_id:number,user_id:number){
    return this._http.post(`${this.apiUrl}/users/add-user-feature`,{featureId:feature_id,userId:user_id})
  }
}
