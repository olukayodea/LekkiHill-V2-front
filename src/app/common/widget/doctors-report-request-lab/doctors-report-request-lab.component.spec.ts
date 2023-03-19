import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsReportRequestLabComponent } from './doctors-report-request-lab.component';

describe('DoctorsReportRequestLabComponent', () => {
  let component: DoctorsReportRequestLabComponent;
  let fixture: ComponentFixture<DoctorsReportRequestLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorsReportRequestLabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsReportRequestLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
