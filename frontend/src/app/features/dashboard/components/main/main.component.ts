import { Component, OnInit } from '@angular/core';
import { CryptoService } from 'src/app/core/services/crypto.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  requiredComponent = "Inventory"

  constructor(private cryptoService:CryptoService) {
    
  }

  ngOnInit(): void {
    
  }

  onToggle(name: string) {
    this.requiredComponent = name
  }
}
