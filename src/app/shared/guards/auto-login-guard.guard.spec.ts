import { TestBed } from '@angular/core/testing';

import { AutoLoginGuardGuard } from './auto-login-guard.guard';

describe('AutoLoginGuardGuard', () => {
  let guard: AutoLoginGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AutoLoginGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
