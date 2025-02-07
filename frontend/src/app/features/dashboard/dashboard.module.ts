import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FilesComponent } from './components/files/files.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { MainComponent } from './components/main/main.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './components/cart/cart.component';
import { ImportProductsComponent } from './components/import-products/import-products.component';
import { CustomDatePipe } from 'src/app/core/pipes/custom-date.pipe';
import { NotificationComponent } from './components/notification/notification.component';
import { ChatComponent } from './components/chat/chat.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FilesComponent,
    InventoryComponent,
    MainComponent,
    ProfileComponent,
    CartComponent,
    ImportProductsComponent,
    CustomDatePipe,
    NotificationComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class DashboardModule {}
