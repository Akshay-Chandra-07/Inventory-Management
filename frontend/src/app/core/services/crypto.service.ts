import { Injectable } from '@angular/core';
import { decrypt } from '../utils/crypto';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor() {}

  decryptData(data:any){
    return decrypt(data)
  }
  getRole(){
    const role = sessionStorage.getItem('role')
    return this.decryptData(role)
  }
  getUserId(){
    const userId = sessionStorage.getItem('userId')
    console.log("in crypto",userId)
    return this.decryptData(userId)
  }
}
