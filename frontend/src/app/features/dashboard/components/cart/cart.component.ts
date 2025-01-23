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
  cartData: Array<Product> | undefined;
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
              // console.log('new quantity', data);
              // this.cartData![productId]['quantity_in_stock'] =
              //   data[0].quantity_in_stock;
              // console.log(this.cartData![productId]);
              localStorage.setItem('cart', JSON.stringify(this.cartData));
              this.cartData = JSON.parse(localStorage.getItem('cart')!);
            },
            error: (error) => {
              console.log(error);
            },
          });
      });
  }

  ngOnInit(): void {
    this.cartData = JSON.parse(localStorage.getItem('cart')!);
    console.log(this.cartData);
  }

  changeToInventoryComponent() {
    this.toggler.emit();
  }

  deleteFromTempcartData(i: any, product_id: any) {
    console.log(this.cartData![i]);
    this.cartData![i].quantity_in_stock =
      this.cartData![i].quantity_in_stock + this.cartData![i].quantity!;
    this.quantitySubject.next({
      productId: JSON.stringify(this.cartData![i].product_id),
      newQuantity: this.cartData![i].quantity_in_stock,
    });
    this.cartData!.splice(i, 1);
  }

  decreaseCartProduct(i: any, product_id: any) {
    this.cartData![i].quantity! -= 1;
    this.cartData![i].quantity_in_stock += 1;
    this.quantitySubject.next({
      productId: JSON.stringify(this.cartData![i].product_id),
      newQuantity: this.cartData![i].quantity_in_stock,
    });
  }

  increaseCartProduct(i: any, product_id: any) {
    this.cartData![i].quantity! += 1;
    this.cartData![i].quantity_in_stock -= 1;
    this.quantitySubject.next({
      productId: JSON.stringify(this.cartData![i].product_id),
      newQuantity: this.cartData![i].quantity_in_stock,
    });
  }
}
