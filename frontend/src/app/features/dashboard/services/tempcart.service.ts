import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TempcartService {
  tempCartData: any;
  preFinalCartData: any;
  finalCartData: any;
  constructor() {}

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
    if (!this.finalCartData) {
      this.finalCartData = {};
    }
    if (this.finalCartData[pId]) {
      delete this.finalCartData[pId];
    } else {
      this.finalCartData[pId] = data;
      console.log(this.finalCartData);
    }
  }

  // sendDataToFinalCart(){
  //   // if(this.finalCartData[0]){
  //   //   this.finalCartData[0].push(this.preFinalCartData)
  //   // }else{
  //   // }
  //   // this.finalCartData.push(...Object.values(this.preFinalCartData))

  //   if(!this.finalCartData){
  //     this.finalCartData = {}
  //   }
  //   this.finalCartData[pId] = data
  //   this.preFinalCartData = undefined
  //   this.tempCartData = undefined
  //   console.log(this.finalCartData)
  // }

  getCartData() {
    this.tempCartData = undefined;
    return this.finalCartData;
  }
}
