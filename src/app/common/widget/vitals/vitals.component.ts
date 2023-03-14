import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { VitalsData } from 'src/app/_models/clinic/vitals';
import { PatientsData } from 'src/app/_models/patients';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-vitals',
  templateUrl: './vitals.component.html',
  styleUrls: ['./vitals.component.css']
})
export class VitalsComponent implements OnInit {
  @Input() patient_id: number;
  @Output() refresh = new EventEmitter<any>();

  patientData: PatientsData

  vitalData: VitalsData;
  processing: boolean = false;

  vitalForm = this.fb.group({
    ref: [''],
    weight: ['', Validators.required],
    height: ['', Validators.required],
    spo2: ['', Validators.required],
    respiratory: ['', Validators.required],
    temprature: ['', Validators.required],
    pulse: ['', Validators.required],
    bp_sys: ['', Validators.required],
    bp_dia: ['', Validators.required]
  });

  get ref() { return this.vitalForm.get('ref'); }
  get weight() { return this.vitalForm.get('weight'); }
  get height() { return this.vitalForm.get('height'); }
  get spo2() { return this.vitalForm.get('spo2'); }
  get respiratory() { return this.vitalForm.get('respiratory'); }
  get temprature() { return this.vitalForm.get('temprature'); }
  get pulse() { return this.vitalForm.get('pulse'); }
  get bp_sys() { return this.vitalForm.get('bp_sys'); }
  get bp_dia() { return this.vitalForm.get('bp_dia'); }

  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private notifyService: NotificationService,
  ) {
    this.patientData = new PatientsData();
  }

  ngOnInit(): void {
    this.getRecentVital(this.patient_id);
    this.getOnePatient( );
  }


  getOnePatient() {
    this.apiService.getOnePatient(this.patient_id).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        if (data.success == true) {
          this.patientData = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  getRecentVital(invoiceRef) {
    this.apiService.getRecentVital(invoiceRef).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        if (data.success == true) {
          this.vitalData = data.data;

          this.vitalForm.patchValue({
            weight: this.vitalData.weight,
            height: this.vitalData.height,
            spo2: this.vitalData.spo2,
            respiratory: this.vitalData.respiratory,
            temprature: this.vitalData.temprature,
            pulse: this.vitalData.pulse,
            bp_sys: this.vitalData.bp_sys,
            bp_dia: this.vitalData.bp_dia,
          });
          
        } else {
          if (data.success === false && data.error.code != 404) {
            this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
          }
        }
      }
    );
  }

  onClose() {
    this.vitalForm.reset();
  }

  onCreate() {
    var data: object = {
      weight: this.vitalForm.value.weight,
      height: this.vitalForm.value.height,
      spo2: this.vitalForm.value.spo2,
      respiratory: this.vitalForm.value.respiratory,
      temprature: this.vitalForm.value.temprature,
      pulse: this.vitalForm.value.pulse,
      bp_sys: this.vitalForm.value.bp_sys,
      bp_dia: this.vitalForm.value.bp_dia,
      patient_id: this.patientData.ref
    };

    this.recordVitals(data);
  }

  recordVitals(data) {
    this.processing = true;

    this.apiService.recordVitals(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Patient's vital details saved", "Record Saved");
          this.ngOnInit();
          document.getElementById('modal-record-vital').click();
          document.getElementById('modal-schedule-appointment').click();
          document.getElementById('modal-post-payment').click();
          document.getElementById('modal-pending-invoice').click();
          document.getElementById('modal-view-clinic').click();
          this.refresh.next();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
      }
    );
  }

}