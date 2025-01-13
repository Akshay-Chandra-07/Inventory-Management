import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements OnInit, ControlValueAccessor {
  constructor() {}

  @Input() type: any;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() help: string = '';
  value: string = '';
  isDisabled: boolean = false;

  ngOnInit(): void {}

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onBlur() {
    this.onTouched();
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  writeValue(value: string) {
    this.value = value;
  }

  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  setDisabledState() {}
}
