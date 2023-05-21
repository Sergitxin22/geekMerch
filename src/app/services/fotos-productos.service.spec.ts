import { TestBed } from '@angular/core/testing';

import { FotosProductosService } from './fotos-productos.service';

describe('FotosProductosService', () => {
  let service: FotosProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FotosProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
