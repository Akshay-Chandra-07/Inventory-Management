import { HttpClient, HttpParams } from '@angular/common/http';
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
    vendors: any,
    unit: string,
    unitPrice: string,
  ) {
    return this._http.post(
      `${this.apiUrl}/products/insert-product-data-to-db`,
      { productName, category, quantity, vendors, unit, unitPrice },
    );
  }

  updateProductData(
    productName: string,
    category: string,
    quantity: string,
    vendors: any,
    unit: string,
    unitPrice: string,
    productId: string,
  ) {
    console.log(
      productName,
      category,
      quantity,
      vendors,
      unit,
      unitPrice,
      productId,
    );
    return this._http.put(`${this.apiUrl}/products/update-product-data-in-db`, {
      productName,
      category,
      quantity,
      vendors,
      unit,
      unitPrice,
      productId,
    });
  }

  getProductData(product_id: string) {
    return this._http.get(
      `${this.apiUrl}/products/get-single-product-data?productId=${product_id}`,
    );
  }

  getProductCount() {
    return this._http.get(`${this.apiUrl}/products/get-product-count`);
  }

  getAllProducts() {
    return this._http.get(`${this.apiUrl}/products/get-all-products`);
  }

  getPageProducts(
    pageNumber: number,
    pageCount: number,
    searchValue: string,
    searchFilters: string[],
  ) {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageCount', pageCount.toString())
      .set('searchValue', searchValue)
      .set('searchFilters', JSON.stringify(searchFilters));
    return this._http.get(`${this.apiUrl}/products/get-page-products?`, {
      params,
    });
  }

  getCategories() {
    return this._http.get(`${this.apiUrl}/categories/get-all-categories`);
  }

  getVendors() {
    return this._http.get(`${this.apiUrl}/vendors/get-all-vendors`);
  }

  uploadProductImageToDb(url: string, product_id: string) {
    return this._http.patch(
      `${this.apiUrl}/products/insert-image-url-to-product-db`,
      { url, product_id },
    );
  }
  deleteProduct(product_id: string) {
    console.log(product_id);
    return this._http.patch(`${this.apiUrl}/products/delete-single-product`, {
      product_id,
    });
  }

  insertExcelProducts(data: any) {
    console.log(data);
    return this._http.post(`${this.apiUrl}/products/insert-excel-products`, {
      data,
    });
  }
}
