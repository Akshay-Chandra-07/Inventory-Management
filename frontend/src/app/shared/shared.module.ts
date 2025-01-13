import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { CustomDropdownComponent } from './custom-dropdown/custom-dropdown.component';
import { PrimaryFormButtonComponent } from './primary-form-button/primary-form-button.component';
import { SecondaryFormButtonComponent } from './secondary-form-button/secondary-form-button.component';

@NgModule({
  declarations: [
    CustomInputComponent,
    CustomDropdownComponent,
    PrimaryFormButtonComponent,
    SecondaryFormButtonComponent,
  ],
  imports: [CommonModule],
  exports: [CustomInputComponent, CustomDropdownComponent],
})
export class SharedModule {}
