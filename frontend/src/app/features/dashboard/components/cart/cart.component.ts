import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TempcartService } from '../../services/tempcart.service';
import { Product } from 'src/app/core/model/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartData: Record<string, Product> | undefined;
  @Output() toggler = new EventEmitter<any>();
  constructor(private tempCartService: TempcartService) {}

  ngOnInit(): void {
    this.getCartDataFromService();
  }

  changeToInventoryComponent() {
    this.toggler.emit();
  }

  getCartDataFromService() {
    this.cartData = this.tempCartService.getCartData();
    console.log(this.cartData);
  }

  deleteFromTempcartData(i: any, product_id: any) {}

  decreaseMoveToCartProduct(key: any, product_id: any) {}

  increaseMoveToCartProduct(key: any, product_id: any) {}
}
