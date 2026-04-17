import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagRendererComponent } from './tag-renderer.component';

describe('TagRendererComponent', () => {
  let component: TagRendererComponent;
  let fixture: ComponentFixture<TagRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
