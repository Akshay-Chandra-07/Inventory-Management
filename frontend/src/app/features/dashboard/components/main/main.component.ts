import { Component, OnInit } from '@angular/core';
import { CryptoService } from 'src/app/core/services/crypto.service';
import { ProfileService } from '../../services/profile.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  requiredComponent = 'Inventory';
  allowedFeatures: any = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  };
  allFeatures: any;
  constructor(
    private cryptoService: CryptoService,
    private profileService: ProfileService,
    private errorService: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.getAllFeatures();
    this.getAllowedFeatures();
  }

  getAllowedFeatures() {
    this.profileService.getAllowedFeatures().subscribe({
      next: (data: any) => {
        console.log(data);
        data.forEach((feature: any) => {
          this.allowedFeatures[feature.feature_id] = true;
        });
        console.log(this.allowedFeatures);
      },
      error: (error: Error) => {
        this.errorService.handleError(error);
      },
    });
  }

  getAllFeatures() {
    this.profileService.getAllFeatures().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allFeatures = data;
      },
      error: (error: Error) => {
        this.errorService.handleError(error);
      },
    });
  }

  onToggle(name: string) {
    this.requiredComponent = name;
  }
}
