import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsReportMedicationComponent } from './doctors-report-medication.component';

describe('DoctorsReportMedicationComponent', () => {
  let component: DoctorsReportMedicationComponent;
  let fixture: ComponentFixture<DoctorsReportMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorsReportMedicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsReportMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
