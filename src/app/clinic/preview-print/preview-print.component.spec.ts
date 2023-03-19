import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPrintComponent } from './preview-print.component';

describe('PreviewPrintComponent', () => {
  let component: PreviewPrintComponent;
  let fixture: ComponentFixture<PreviewPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
