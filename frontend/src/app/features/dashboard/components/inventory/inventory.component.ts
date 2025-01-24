import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FilesService } from '../../services/files.service';
import { TempcartService } from '../../services/tempcart.service';
import { Product } from 'src/app/core/model/product';
import { NgToastService } from 'ng-angular-popup';
import { debounceTime, Subject } from 'rxjs';
import { generatePdf } from '../../../../core/utils/downloadPdf';
import { downloadExcel } from '../../../../core/utils/downloadExcel';
import { importFile } from 'src/app/core/utils/importExcel';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  pageNumber: number = 1;
  pageCount: number = 7;
  productCount: number = 0;
  lastPage: number = 1;
  inventoryData: any;
  moveToCartData: Record<string, Product> | undefined;
  file: any;

  editingData: any;

  productsInCart: any;

  moveToCartQuantityProducts: any;

  searchFilters = {
    category: false,
    productName: false,
    vendor: false,
  };

  private searchSubject = new Subject<{
    pageNumber: number;
    pageCount: number;
    searchValue: string;
    searchFilter: string[];
  }>();

  @Output() toggler = new EventEmitter<any>();

  categories: string[] = [];
  vendors: any[] = [];

  constructor(
    private inventoryService: InventoryService,
    private filesService: FilesService,
    private tempcartService: TempcartService,
    private toast: NgToastService,
  ) {
    this.searchSubject
      .pipe(debounceTime(500))
      .subscribe(({ pageNumber, pageCount, searchValue, searchFilter }) => {
        this.inventoryService
          .getPageProducts(pageNumber, pageCount, searchValue, searchFilter)
          .pipe()
          .subscribe({
            next: (data: any) => {
              console.log(searchValue, searchFilter);
              console.log('fetched');
              console.log(data);
              this.inventoryData = data.cleanedProducts[0];
              this.productCount = data.cleanedProducts[1];
              this.lastPage = Math.ceil(this.productCount / this.pageCount);
              console.log(this.inventoryData);
            },
            error(error) {
              console.log(error);
            },
          });
      });
  }

  searchForm = new FormGroup({
    inputValue: new FormControl(''),
  });

  addProductForm = new FormGroup({
    productName: new FormControl(''),
    category: new FormControl(''),
    vendor: new FormArray([]),
    quantity: new FormControl(''),
    unit: new FormControl(''),
    unitPrice: new FormControl(''),
    productImage: new FormControl(''),
  });

  ngOnInit(): void {
    this.moveToCartData = this.tempcartService.fetchTempcartData();
    this.productsInCart = this.tempcartService.getCartData();
    this.fetchPageProducts();
    this.fetchCategories();
    this.fetchVendors();
  }
  toggleVendorSelection(i: any) {
    this.vendors[i].selected = !this.vendors[i].selected;
  }

  fetchCategories() {
    this.inventoryService
      .getCategories()
      .pipe()
      .subscribe({
        next: (data: any) => {
          data.forEach((value: any) => {
            this.categories.push(value.category_name);
          });
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  fetchVendors() {
    this.inventoryService
      .getVendors()
      .pipe()
      .subscribe({
        next: (data: any) => {
          data.forEach((value: any) => {
            this.vendors.push({ name: value.vendor_name, selected: false });
          });
          console.log(this.vendors);
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  onPageNext() {
    console.log('next');
    this.pageNumber += 1;
    this.onSearch();
  }

  onPagePrevious() {
    console.log('previous');
    this.pageNumber -= 1;
    this.onSearch();
  }

  onFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.file = input.files[0];
      console.log('added file');
    }
  }

  fetchPageProducts() {
    this.inventoryService
      .getPageProducts(this.pageNumber, this.pageCount, '', [''])
      .pipe()
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.productCount = data.cleanedProducts[1];
          this.inventoryData = data.cleanedProducts[0];
          this.lastPage = Math.ceil(this.productCount / this.pageCount);
          console.log(this.productCount);
        },
        error(error) {
          console.log(error);
        },
      });
  }

  updateProductFormSubmit() {
    console.log(this.addProductForm.value);
    this.vendors.forEach((vendor) => {
      if (vendor.selected) {
        (this.addProductForm.get('vendor') as FormArray).push(
          new FormControl(vendor.name),
        );
      }
    });
    console.log(this.addProductForm);
    this.inventoryService
      .updateProductData(
        this.addProductForm.controls.productName.value!,
        this.addProductForm.controls.category.value!,
        this.addProductForm.controls.quantity.value!,
        this.addProductForm.controls.vendor.value!,
        this.addProductForm.controls.unit.value!,
        this.addProductForm.controls.unitPrice.value!,
        this.editingData.product_id,
      )
      .pipe()
      .subscribe({
        next: (data1: any) => {
          this.toast.success({ detail: data1.msg, duration: 2000 });
          this.vendors.forEach((vendor: any) => {
            vendor.selected = false;
          });
          if (this.file) {
            this.uploadFile([this.editingData.product_id]);
          } else {
            this.onSearch();
          }
        },
        error: (error: any) => {
          console.log(error);
          this.toast.success({ detail: error.error.msg, duration: 2000 });
        },
      });
  }

  onAddProductFormSubmit() {
    console.log(this.addProductForm.value);
    this.vendors.forEach((vendor) => {
      if (vendor.selected) {
        (this.addProductForm.get('vendor') as FormArray).push(
          new FormControl(vendor.name),
        );
      }
    });
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
          this.toast.success({ detail: data1.msg, duration: 2000 });
          this.vendors = [];
          if (this.file) {
            this.uploadFile(data1.productId);
          } else {
            this.onSearch();
          }
        },
        error: (error: any) => {
          console.log(error);
          this.toast.success({ detail: error.error.msg, duration: 2000 });
        },
      });
  }

  uploadFile(productId: any) {
    console.log(productId);
    const fileName = this.file.name.replace(/\s+/g, '');
    const fileType = this.file.type;
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
                  .uploadProductImageToDb(data2.fileKey, productId)
                  .pipe()
                  .subscribe({
                    next: (data3: any) => {
                      console.log(data3);
                      this.toast.success({
                        detail: 'Uploaded product image to db',
                      });
                      this.onSearch();
                    },
                    error(error: any) {
                      console.log(error);
                    },
                  });
              },
              error: (error) => {
                console.log(error);
                this.toast.error({
                  detail: error.error.msg,
                  duration: 2000,
                });
              },
            });
        },
        error(error: any) {
          console.log(error);
        },
      });
  }

  increaseMoveToCartProduct(i: string, product_id: number) {
    this.tempcartService.increaseTempCartQuantity(product_id);
  }

  decreaseMoveToCartProduct(i: string, product_id: number) {
    this.tempcartService.decreaseTempCartQuantity(product_id);
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
    // if (this.moveToCartData) {
    //   console.log(this.moveToCartData[p_id]);
    //   this.tempcartService.modifyPreFinalCart(p_id, this.moveToCartData[p_id]);
    // }
    this.tempcartService.toggleCheckbox(p_id);
  }

  onMoveToFinalCart() {
    // this.moveToCartQuantityProducts =
    //   this.tempcartService.getPreFinalCartData();
    // if (this.moveToCartQuantityProducts) {
    //   for (let key of Object.keys(this.moveToCartQuantityProducts)) {
    //     const newQuantity =
    //       this.moveToCartQuantityProducts[key]['quantity_in_stock'] -
    //       this.moveToCartQuantityProducts[key]['quantity'];
    //     this.tempcartService
    //       .modifyQuantityInDb(key, newQuantity)
    //       .pipe()
    //       .subscribe({
    //         next: (data: any) => {
    //           console.log(data);
    //         },
    //         error: (error: any) => {
    //           console.log(error);
    //         },
    //       });
    //   }
    // }
    this.tempcartService.populateFinalCart();
    this.toggler.emit('changing');
  }

  onVendorSelect(event: Event, product_id: any) {
    const input = event.target as HTMLSelectElement;
    console.log(input.value);
    this.tempcartService.changeVendorSelection(input.value, product_id);
  }

  changeToCartComponent() {
    console.log('changing event');
    this.toggler.emit('changing');
  }

  onSearch(event?: Event) {
    const selectedCategoryList = [];
    if (this.searchFilters.category) {
      selectedCategoryList.push('Category');
    }
    if (this.searchFilters.productName) {
      selectedCategoryList.push('ProductName');
    }
    if (this.searchFilters.vendor) {
      selectedCategoryList.push('Vendor');
    }
    this.searchSubject.next({
      pageNumber: this.pageNumber,
      pageCount: this.pageCount,
      searchValue: this.searchForm.value.inputValue!,
      searchFilter: selectedCategoryList,
    });
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

  onDeleteProduct(product_id: string) {
    console.log(product_id);
    this.inventoryService
      .deleteProduct(product_id)
      .pipe()
      .subscribe({
        next: (data: any) => {
          this.toast.info({ detail: data.msg });
          this.onSearch();
        },
        error: (error: any) => {
          this.toast.error({ detail: error.error.msg });
        },
      });
  }

  onEditingProduct(data: any) {
    this.editingData = data;
    this.editingData.vendors.forEach((vendor: any) => {
      this.vendors.forEach((data: any) => {
        if (data.name == vendor.vendor_name) {
          data.selected = true;
        }
      });
    });
    this.addProductForm.patchValue({
      productName: this.editingData.product_name,
      category: this.editingData.category_name,
      productImage: this.editingData.product_image,
      unit: this.editingData.unit,
      quantity: this.editingData.quantity_in_stock,
      unitPrice: this.editingData.unit_price,
    });
  }

  closingEditModal() {
    this.vendors.forEach((vendor: any) => {
      vendor.selected = false;
    });
    this.addProductForm.patchValue({
      productName: '',
      category: '',
      productImage: '',
      unit: '',
      quantity: '',
    });
  }

  onDownloadRow(data: any) {
    generatePdf(data);
  }

  downloadExcel() {
    downloadExcel(this.moveToCartData);
    this.moveToCartData = {};
  }

  async onImportFile() {
    const data = await importFile(this.file);
    this.inventoryService
      .insertExcelProducts(data)
      .pipe()
      .subscribe({
        next: (data: any) => {
          this.toast.success({ detail: data.msg, duration: 2000 });
          this.onSearch();
        },
        error: (error: any) => {
          this.toast.error({ detail: error.error.msg });
        },
      });
  }
}
