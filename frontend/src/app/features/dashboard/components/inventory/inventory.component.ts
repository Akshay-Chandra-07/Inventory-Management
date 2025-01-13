import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  inventoryData: any = [
    {
      name: 'Maggie',
      status: 'Available',
      category: 'food',
      vendors: ['swiggy', 'zomato', 'zepto'],
      quantity: 200,
      unit: 'grams',
    },
    {
      name: 'Maggie',
      status: 'Sold Out',
      category: 'food',
      vendors: ['swiggy', 'zomato', 'zepto', 'blinkit'],
      quantity: 200,
      unit: 'grams',
    },
    {
      name: 'Maggie',
      status: 'Sold Out',
      category: 'food',
      vendors: ['swiggy', 'zomato', 'zepto', 'blinkit'],
      quantity: 200,
      unit: 'grams',
    },
    {
      name: 'Maggie',
      status: 'Sold Out',
      category: 'food',
      vendors: ['swiggy', 'zomato', 'zepto', 'blinkit'],
      quantity: 200,
      unit: 'grams',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
