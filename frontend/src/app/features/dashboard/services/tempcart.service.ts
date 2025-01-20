import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TempcartService {
  tempCartData: any;
  preFinalCartData: any;
  finalCartData: any;
  apiUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  fetchTempcartData() {
    return this.tempCartData;
  }

  modifyTempcart(pId: any, data: any) {
    if (!this.tempCartData) {
      this.tempCartData = {};
    }
    if (this.tempCartData[pId]) {
      delete this.tempCartData[pId];
    } else {
      data.quantity = 1;
      this.tempCartData[pId] = data;
    }
    console.log(this.tempCartData);
  }

  modifyPreFinalCart(pId: any, data: any) {
    if (!this.preFinalCartData) {
      this.preFinalCartData = {};
    }
    if (!this.finalCartData) {
      this.finalCartData = {};
    }
    if (this.finalCartData[pId]) {
      delete this.preFinalCartData[pId];
      delete this.finalCartData[pId];
    } else {
      this.finalCartData[pId] = data;
      this.preFinalCartData[pId] = data;
      console.log(this.finalCartData);
      console.log(this.preFinalCartData);
    }
  }

  // modifyProductQuantity(){
  //   if(this.preFinalCartData){
  //     for(let key of Object.keys(this.preFinalCartData)){
  //       console.log(this.preFinalCartData[key]['quantity'])
  //       const newQuantity = this.preFinalCartData[key]['quantity_in_stock']-this.preFinalCartData[key]['quantity']
  //       this._http.patch(`${this.apiUrl}/products/update-quantity`,newQuantity).pipe().subscribe()
  //     }
  //   }
  // }

  modifyQuantityInDb(p_id: string, newQuantity: number) {
    return this._http.patch(`${this.apiUrl}/products/update-quantity`, {
      p_id,
      newQuantity,
    });
  }

  getPreFinalCartData() {
    return this.preFinalCartData;
  }

  getCartData() {
    if (this.finalCartData) {
      localStorage.setItem('cart', JSON.stringify(this.finalCartData));
    }
    this.tempCartData = undefined;
    this.preFinalCartData = undefined;
  }
}
