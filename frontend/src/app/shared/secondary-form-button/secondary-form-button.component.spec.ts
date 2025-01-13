import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryFormButtonComponent } from './secondary-form-button.component';

describe('SecondaryFormButtonComponent', () => {
  let component: SecondaryFormButtonComponent;
  let fixture: ComponentFixture<SecondaryFormButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondaryFormButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecondaryFormButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
