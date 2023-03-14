import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOpComponent } from './post-op.component';

describe('PostOpComponent', () => {
  let component: PostOpComponent;
  let fixture: ComponentFixture<PostOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostOpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
