import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TempcartService } from '../../services/tempcart.service';
import { Product } from 'src/app/core/model/product';
import { debounceTime, Subject } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartData: Record<string, Product> | undefined;
  private quantitySubject = new Subject<{
    productId: string;
    newQuantity: number;
  }>();
  @Output() toggler = new EventEmitter<any>();
  constructor(
    private tempCartService: TempcartService,
    private inventoryService: InventoryService,
  ) {
    this.quantitySubject
      .pipe(debounceTime(1000))
      .subscribe(({ productId, newQuantity }) => {
        this.tempCartService
          .modifyQuantityInDb(productId, newQuantity)
          .subscribe({
            next: (data: any) => {
              console.log('new quantity', data);
              this.cartData![productId]['quantity_in_stock'] =
                data[0].quantity_in_stock;
              console.log(this.cartData![productId]);
            },
            error: (error) => {
              console.log(error);
            },
          });
      });
  }

  ngOnInit(): void {
    this.getCartDataFromService();
  }

  changeToInventoryComponent() {
    this.toggler.emit();
  }

  getCartDataFromService() {
    this.tempCartService.getCartData();
    this.cartData = JSON.parse(localStorage.getItem('cart')!);
    console.log(this.cartData);
  }

  deleteFromTempcartData(i: any, product_id: any) {}

  decreaseCartProduct(i: any, product_id: any) {
    this.cartData![i].quantity! -= 1;
    this.cartData![i].quantity_in_stock += 1;
    this.quantitySubject.next({
      productId: product_id,
      newQuantity: this.cartData![i].quantity_in_stock,
    });
  }

  increaseCartProduct(i: any, product_id: any) {
    this.cartData![i].quantity! += 1;
    this.cartData![i].quantity_in_stock -= 1;
    this.quantitySubject.next({
      productId: product_id,
      newQuantity: this.cartData![i].quantity_in_stock,
    });
  }
}
