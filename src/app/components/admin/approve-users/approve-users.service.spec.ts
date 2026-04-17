import { TestBed } from '@angular/core/testing';

import { ApproveUsersService } from './approve-users.service';

describe('ApproveUsersService', () => {
  let service: ApproveUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproveUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
