import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLabComponent } from './request-lab.component';

describe('RequestLabComponent', () => {
  let component: RequestLabComponent;
  let fixture: ComponentFixture<RequestLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestLabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
