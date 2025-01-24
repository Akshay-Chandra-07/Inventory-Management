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
      data.selected = false;
      data.quantity = 1;
      data.selectedVendor = data.vendors[0].vendor_name;
      this.tempCartData[pId] = data;
    }
  }

  changeVendorSelection(value: any, product_id: any) {
    this.tempCartData[product_id].selectedVendor = value;
    console.log(this.tempCartData);
  }

  toggleCheckbox(p_id: any) {
    this.tempCartData[p_id].selected = !this.tempCartData[p_id].selected;
    console.log(this.tempCartData);
  }

  populateFinalCart() {
    if (!this.preFinalCartData) {
      this.preFinalCartData = {};
    }
    for (let key of Object.keys(this.tempCartData)) {
      if (this.tempCartData[key].selected) {
        let newQuantity =
          this.tempCartData[key].quantity_in_stock -
          this.tempCartData[key].quantity;
        this.modifyQuantityInDb(
          this.tempCartData[key].product_id,
          newQuantity,
        ).subscribe({
          next: (data: any) => {
            this.tempCartData[key].quantity_in_stock = newQuantity;
            this.preFinalCartData[key] = this.tempCartData[key];
            console.log(this.preFinalCartData);
            this.updateFinalCart(this.preFinalCartData);
          },
        });
      }
    }
  }

  increaseTempCartQuantity(id: any) {
    this.tempCartData[id].quantity += 1;
  }

  decreaseTempCartQuantity(id: any) {
    this.tempCartData[id].quantity -= 1;
  }

  updateFinalCart(data: any) {
    let curCart = [];
    if (!localStorage.getItem('cart')) {
      console.log('local storage empty');
      if (this.preFinalCartData) {
        for (let key of Object.keys(this.preFinalCartData)) {
          curCart.push(this.preFinalCartData[key]);
        }
        localStorage.setItem('cart', JSON.stringify(curCart));
      }
    } else {
      console.log('Local storage not empty');
      curCart = JSON.parse(localStorage.getItem('cart')!);
      console.log('present cart', curCart);
      for (let key of Object.keys(this.preFinalCartData)) {
        console.log(this.preFinalCartData[key]);
        let bool = true;
        for (let i = 0; i < curCart.length; i++) {
          if (curCart[i].product_id == this.preFinalCartData[key].product_id) {
            curCart[i].quantity_in_stock =
              this.preFinalCartData[key].quantity_in_stock;
            if (
              curCart[i].selectedVendor ==
              this.preFinalCartData[key].selectedVendor
            ) {
              curCart[i].quantity += this.preFinalCartData[key].quantity;
              bool = false;
              console.log('updated quantity');
            }
          }
        }
        if (bool) {
          console.log('added product');
          curCart.push(this.preFinalCartData[key]);
        }
      }
      localStorage.setItem('cart', JSON.stringify(curCart));
    }
    console.log(JSON.parse(localStorage.getItem('cart')!));
    this.preFinalCartData = {};
  }

  // modifyPreFinalCart(pId: any, data: any) {
  //   if (!this.preFinalCartData) {
  //     this.preFinalCartData = {};
  //   }
  //   if (!this.finalCartData) {
  //     this.finalCartData = {};
  //   }
  //   if (this.finalCartData[pId]) {
  //     delete this.preFinalCartData[pId];
  //     delete this.finalCartData[pId];
  //   } else {
  //     this.finalCartData[pId] = data;
  //     this.preFinalCartData[pId] = data;
  //     console.log(this.finalCartData);
  //     console.log(this.preFinalCartData);
  //   }
  // }

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
    console.log('modifying quantity in db', p_id, newQuantity);
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
