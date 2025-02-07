import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TempcartService } from '../../services/tempcart.service';
import { Product } from 'src/app/core/model/product';
import { debounceTime, Subject } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CryptoService } from 'src/app/core/services/crypto.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartData: Array<Product> | undefined;
  searchCart: Array<Product> | undefined;
  role : any;
  private quantitySubject = new Subject<{
    productId: string;
    newQuantity: number;
  }>();
  @Output() toggler = new EventEmitter<string>();
  constructor(
    private tempCartService: TempcartService,
    private inventoryService: InventoryService,
    private errorHandler: ErrorHandlerService,
    private cryptoService : CryptoService
  ) {
    this.quantitySubject
      .pipe(debounceTime(1000))
      .subscribe(({ productId, newQuantity }) => {
        this.tempCartService
          .modifyQuantityInDb(productId, newQuantity)
          .subscribe({
            next: (data: any) => {
              localStorage.setItem('cart', JSON.stringify(this.cartData));
              this.cartData = JSON.parse(localStorage.getItem('cart')!);
            },
            error: (error) => {
              this.errorHandler.handleError(error);
            },
          });
      });
  }

  ngOnInit(): void {
    if (localStorage.getItem('cart')) {
      let data = localStorage.getItem('cart');
      if (data) {
        this.cartData = JSON.parse(data);
      }
    }
    this.role = this.cryptoService.getRole()['role']
  }

  searchForm = new FormGroup({
    inputValue: new FormControl(''),
  });

  searchFilters = {
    category: false,
    productName: false,
    vendor: false,
  };

  onSearch(event: Event) {
    if (this.searchForm.value.inputValue) {
      let key: string = this.searchForm.value.inputValue.toLowerCase();
      console.log(key);
      this.searchCart = JSON.parse(localStorage.getItem('cart')!);
      this.cartData = undefined;
      if (this.searchCart) {
        this.cartData = this.searchCart.filter((product: any) => {
          const matchesProductName =
            this.searchFilters.productName &&
            product.product_name.toLowerCase().includes(key);
          const matchesCategoryName =
            this.searchFilters.category &&
            product.category_name.toLowerCase().includes(key);
          const matchesVendor =
            this.searchFilters.vendor &&
            product.selectedVendor.toLowerCase().includes(key);
          if (
            this.searchFilters.productName ||
            this.searchFilters.category ||
            this.searchFilters.vendor
          ) {
            return matchesProductName || matchesCategoryName || matchesVendor;
          }
          return (
            product.product_name.toLowerCase().includes(key) ||
            product.category_name.toLowerCase().includes(key) ||
            product.selectedVendor.toLowerCase().includes(key)
          );
        });
      }
    } else {
      if (localStorage.getItem('cart')) {
        let data = localStorage.getItem('cart');
        if (data) {
          this.cartData = JSON.parse(data);
        }
      }
    }
  }

  onAddSearchFilter(filterName: string) {
    if (filterName == 'ProductName') {
      this.searchFilters.productName = !this.searchFilters.productName;
    } else if (filterName == 'Category') {
      this.searchFilters.category = !this.searchFilters.category;
    } else {
      this.searchFilters.vendor = !this.searchFilters.vendor;
    }
    console.log(this.searchFilters);
  }

  changeToInventoryComponent() {
    this.toggler.emit("Inventory");
  }
  changeToExcelFilesComponent(){
    this.toggler.emit("Files")
  }
  changeToChatsComponent(){
    this.toggler.emit("Chats")
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
    for (let j = 0; j < this.cartData!.length; j++) {
      if (
        i != j &&
        this.cartData![i].product_id == this.cartData![j].product_id
      ) {
        this.cartData![j].quantity_in_stock =
          this.cartData![i].quantity_in_stock;
      }
    }
    this.quantitySubject.next({
      productId: JSON.stringify(this.cartData![i].product_id),
      newQuantity: this.cartData![i].quantity_in_stock,
    });
  }

  increaseCartProduct(i: any, product_id: any) {
    this.cartData![i].quantity! += 1;
    this.cartData![i].quantity_in_stock -= 1;
    for (let j = 0; j < this.cartData!.length; j++) {
      if (
        i != j &&
        this.cartData![i].product_id == this.cartData![j].product_id
      ) {
        this.cartData![j].quantity_in_stock =
          this.cartData![i].quantity_in_stock;
      }
    }
    this.quantitySubject.next({
      productId: JSON.stringify(this.cartData![i].product_id),
      newQuantity: this.cartData![i].quantity_in_stock,
    });
  }

  ngOnDestroy(): void {
    console.log('destroying');
  }
}
