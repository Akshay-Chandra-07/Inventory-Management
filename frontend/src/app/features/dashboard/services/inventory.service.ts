import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  apiUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  insertProductData(
    productName: string,
    category: string,
    quantity: string,
    vendor: string,
    unit: string,
    unitPrice: string,
  ) {
    return this._http.post(
      `${this.apiUrl}/products/insert-product-data-to-db`,
      { productName, category, quantity, vendor, unit, unitPrice },
    );
  }

  getProductCount() {
    return this._http.get(`${this.apiUrl}/products/get-product-count`);
  }

  getAllProducts() {
    return this._http.get(`${this.apiUrl}/products/get-all-products`);
  }

  getPageProducts(pageNumber: number, pageCount: number) {
    return this._http.get(
      `${this.apiUrl}/products/get-page-products?pageNumber=${pageNumber}&pageCount=${pageCount}`,
    );
  }

  uploadProductImageToDb(url: string, product_id: string) {
    return this._http.patch(
      `${this.apiUrl}/products/insert-image-url-to-product-db`,
      { url, product_id },
    );
  }
}
