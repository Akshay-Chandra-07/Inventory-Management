import { TestBed } from '@angular/core/testing';

import { TempcartService } from './tempcart.service';

describe('TempcartService', () => {
  let service: TempcartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempcartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
