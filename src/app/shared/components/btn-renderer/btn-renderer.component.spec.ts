import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnRendererComponent } from './btn-renderer.component';

describe('BtnRendererComponent', () => {
  let component: BtnRendererComponent;
  let fixture: ComponentFixture<BtnRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
