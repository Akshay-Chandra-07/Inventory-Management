import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  requiredComponent = "Inventory"

  constructor() {}

  ngOnInit(): void {}

  onToggle(name: string) {
    this.requiredComponent = name
  }
}
