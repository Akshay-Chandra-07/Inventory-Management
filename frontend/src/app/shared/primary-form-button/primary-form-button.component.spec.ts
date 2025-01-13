import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryFormButtonComponent } from './primary-form-button.component';

describe('PrimaryFormButtonComponent', () => {
  let component: PrimaryFormButtonComponent;
  let fixture: ComponentFixture<PrimaryFormButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrimaryFormButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrimaryFormButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
