import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  pageNumber : number = 1;
  pageCount : number = 10;
  productCount : number = 0;
  inventoryData: any ;

  constructor(private inventoryService:InventoryService) {}

  ngOnInit(): void {
    this.fetchProductCount()
    this.fetchPageProducts()
  }

  onPageNext(){
    console.log("next")
    this.pageNumber += 1;
    this.fetchPageProducts()
  }

  onPagePrevious(){
    console.log("previous")
    this.pageNumber -= 1;
    this.fetchPageProducts()
  }



  fetchProductCount(){
    this.inventoryService.getProductCount().pipe().subscribe({
      next:(data:any)=>{
        this.productCount = data
        console.log(this.productCount)
      },error(error:any){
        console.log(error)
      }
    })
  }

  fetchPageProducts(){
    this.inventoryService.getPageProducts(this.pageNumber,this.pageCount).pipe().subscribe({
      next:(data:any)=>{
        console.log(data)
        this.inventoryData = data.cleanedProducts
        console.log(this.inventoryData)
      },error(error){
        console.log(error)
      }
    })
  }
}
