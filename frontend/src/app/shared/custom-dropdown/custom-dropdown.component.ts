import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDropdownComponent),
      multi: true,
    },
  ],
})
export class CustomDropdownComponent implements OnInit {
  @Input() value: any = '';
  onTouch: any = () => {};
  onChange: any = () => {};
  @Input() options: any = [];
  @Input() label: string = '';
  @Input() placeholder: string = '';
  constructor() {}

  ngOnInit(): void {}

  writeValue(value: any) {
    this.value = value;
    this.onChange(this.value);
    this.onTouch();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
    this.onTouch();
  }
}
