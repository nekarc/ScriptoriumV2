import { TestBed } from '@angular/core/testing';

import { FlaskapiService } from './flaskapi.service';

describe('FlaskapiService', () => {
  let service: FlaskapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlaskapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
