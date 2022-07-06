import { TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestingModule } from '../testing-utils';

import { ApiService } from './api.service';

describe('ApiserviceService', () => {
  let service: ApiService;

  beforeEach(waitForAsync(() => {
    configureTestingModule({
        providers: [
          ApiService,
        ]
    }).compileComponents();
  }));

  beforeEach(() => {
      service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});