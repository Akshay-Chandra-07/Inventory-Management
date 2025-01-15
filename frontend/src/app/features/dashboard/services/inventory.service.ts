import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  apiUrl = environment.apiUrl
  constructor(private _http:HttpClient) { }

  getProductCount(){
    return this._http.get(`${this.apiUrl}/products/get-product-count`)
  }

  getAllProducts(){
    return this._http.get(`${this.apiUrl}/products/get-all-products`)
  }

  getPageProducts(pageNumber:number,pageCount:number){
    return this._http.get(`${this.apiUrl}/products/get-page-products?pageNumber=${pageNumber}&pageCount=${pageCount}`,)
  }

}
