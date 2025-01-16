import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  toggleComponents: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  onToggle(event: Event) {
    console.log(event);

    this.toggleComponents = !this.toggleComponents;
  }
}
