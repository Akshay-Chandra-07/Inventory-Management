import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FilesService } from '../../services/files.service';
import { TempcartService } from '../../services/tempcart.service';
import { Product } from 'src/app/core/model/product';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  pageNumber: number = 1;
  pageCount: number = 10;
  productCount: number = 0;
  lastPage: number = 1;
  inventoryData: any;
  moveToCartData: Record<string, Product> | undefined;
  file: any;
  productsInCart: any;

  @Output() toggler = new EventEmitter<any>();

  categories = ['Snacks', 'beverages', 'cosmetics'];
  vendors = ['Vendor A', 'zomato', 'zepto'];

  constructor(
    private inventoryService: InventoryService,
    private filesService: FilesService,
    private tempcartService: TempcartService,
  ) {}

  addProductForm = new FormGroup({
    productName: new FormControl(''),
    category: new FormControl(''),
    vendor: new FormControl(''),
    quantity: new FormControl(''),
    unit: new FormControl(''),
    unitPrice: new FormControl(''),
    productImage: new FormControl(''),
  });

  ngOnInit(): void {
    this.moveToCartData = this.tempcartService.fetchTempcartData();
    this.productsInCart = this.tempcartService.getCartData();
    console.log(this.productsInCart);
    this.fetchProductCount();
    this.fetchPageProducts();
  }

  onPageNext() {
    console.log('next');
    this.pageNumber += 1;
    this.fetchPageProducts();
  }

  onPagePrevious() {
    console.log('previous');
    this.pageNumber -= 1;
    this.fetchPageProducts();
  }

  onFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.file = input.files[0];
    }
  }

  fetchProductCount() {
    this.inventoryService
      .getProductCount()
      .pipe()
      .subscribe({
        next: (data: any) => {
          this.productCount = data[0]['count(*)'];
          this.lastPage = Math.ceil(this.productCount / this.pageCount);
        },
        error(error: any) {
          console.log(error);
        },
      });
  }

  fetchPageProducts() {
    this.inventoryService
      .getPageProducts(this.pageNumber, this.pageCount)
      .pipe()
      .subscribe({
        next: (data: any) => {
          this.inventoryData = data.cleanedProducts;
        },
        error(error) {
          console.log(error);
        },
      });
  }

  onAddProductFormSubmit() {
    const fileName = this.file.name.replace(/\s+/g, '');
    const fileType = this.file.type;
    this.inventoryService
      .insertProductData(
        this.addProductForm.controls.productName.value!,
        this.addProductForm.controls.category.value!,
        this.addProductForm.controls.quantity.value!,
        this.addProductForm.controls.vendor.value!,
        this.addProductForm.controls.unit.value!,
        this.addProductForm.controls.unitPrice.value!,
      )
      .pipe()
      .subscribe({
        next: (data1: any) => {
          console.log(data1);
          this.filesService
            .getPresignedUrl(fileName, fileType)
            .pipe()
            .subscribe({
              next: (data2: any) => {
                console.log(data2);
                this.filesService
                  .uploadToUrl(this.file, data2.url)
                  .pipe()
                  .subscribe({
                    next: (data3: any) => {
                      console.log('uploaded image to s3');
                      this.inventoryService
                        .uploadProductImageToDb(data2.fileKey, data1.productId)
                        .pipe()
                        .subscribe({
                          next: (data3: any) => {
                            console.log(data3);
                            this.fetchProductCount();
                            this.fetchPageProducts();
                          },
                          error(error: any) {
                            console.log(error);
                          },
                        });
                    },
                    error(error) {
                      console.log(error);
                    },
                  });
              },
              error(error: any) {
                console.log(error);
              },
            });
        },
        error(error: any) {
          console.log(error);
        },
      });
  }

  increaseMoveToCartProduct(i: string, product_id: number) {
    console.log(this.moveToCartData![i].quantity);
    console.log('quantity increasing', this.moveToCartData![i].quantity);
    this.moveToCartData![i].quantity! += 1;
    console.log(this.moveToCartData![i].quantity);
  }

  decreaseMoveToCartProduct(i: string, product_id: number) {
    console.log(this.moveToCartData![i].quantity);
    console.log('quantity decreasing', this.moveToCartData![i].quantity);
    this.moveToCartData![i].quantity! -= 1;
    console.log(this.moveToCartData![i].quantity);
  }

  onChangeCheckbox(i: any, p_id: any) {
    this.tempcartService.modifyTempcart(p_id, this.inventoryData[i]);
    this.onMoveToCart();
  }

  deleteFromTempcartData(i: any, p_id: any) {
    this.onChangeCheckbox(i, p_id);
  }

  onMoveToCart() {
    this.moveToCartData = this.tempcartService.fetchTempcartData();
    console.log(this.moveToCartData);
  }

  onChangeModalCheckbox(i: any, p_id: any) {
    console.log(i, p_id);
    if (this.moveToCartData) {
      console.log(this.moveToCartData[p_id]);
      this.tempcartService.modifyPreFinalCart(p_id, this.moveToCartData[p_id]);
    }
  }

  onMoveToFinalCart() {
    // this.tempcartService.sendDataToFinalCart()
    // this.productsInCart = this.tempcartService.getCartData()
    // console.log(this.productsInCart)
    this.fetchPageProducts();
    this.toggler.emit('changing');
  }

  changeToCartComponent() {
    console.log('changing event');
    this.toggler.emit('changing');
  }
}
