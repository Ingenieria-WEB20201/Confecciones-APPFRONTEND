import { TestBed } from '@angular/core/testing';

import { ProductoAlmacenService } from './producto-almacen.service';

describe('ProductoAlmacenService', () => {
  let service: ProductoAlmacenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoAlmacenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
