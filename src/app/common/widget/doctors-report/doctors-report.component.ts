import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-doctors-report',
  templateUrl: './doctors-report.component.html',
  styleUrls: ['./doctors-report.component.css']
})
export class DoctorsReportComponent implements OnInit {
  @Input() patient_id: number;
  @Output() refresh = new EventEmitter<any>();
  
  processing: boolean = false;

  medicationList: any[] = [];
  labList: any[] = [];

  deleteIndex: number;
  deleteType: string;

  config = {
    placeholder: 'Type your notes here',
    tabsize: 2,
    height: '300px'
  }

  pageForm = this.fb.group({
    report: ['', Validators.required]
  });

  get report() { return this.pageForm.get('report'); }


  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
  }

  onCreate() {
    var data: object = {
      patient_id: this.patient_id,
      report: this.pageForm.value.report
    }

    console.log(data);

    this.recordNote(data);
  }

  recordNote(data) {
    this.processing = true;

    this.apiService.recordNote(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {

          let medCount = 0;
          let labCount = 0;

          if (this.medicationList.length > 0) {
            this.medicationList.forEach(element => {
              element.doctors_report_id = user.data.ref;
              this.apiService.recordMedicationAsync(element).then(patientData => {
                if (patientData.success == true) {
                  medCount = medCount + 1;
                }
              });
            });
          }

          if (this.labList.length > 0) {
            this.labList.forEach(element => {
              element.doctors_report_id = user.data.ref;
              this.apiService.recordLabTestAsync(element).then(patientData => {
                if (patientData.success == true) {
                  labCount = labCount + 1;
                }
              });
            });
          }
  
          this.notifyService.showSuccess("Patient's details saved", "Notes Saved");
          if (medCount > 0) {
            this.notifyService.showSuccess("Numbers of Medications saved to note: " + medCount, "Notes Saved");
          }
          if (labCount > 0) {
            this.notifyService.showSuccess("Numbers of Lab request saved to note: " + medCount, "Notes Saved");
          }
          this.pageForm.reset();
          this.medicationList = [];
          this.labList = [];
          this.ngOnInit();
          document.getElementById('modal-post-op').click();
          document.getElementById('modal-medication').click();
          document.getElementById('modal-fluid-balance').click();
          document.getElementById('modal-doctors-report').click();
          document.getElementById('modal-request-lab').click();

          this.refresh.next();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
      }
    );
  }

  getMedication( data ) {
    this.medicationList.push(data);
  }

  getLabRequest(data) {
    this.labList = data;
  }

  getIndexFOrMedication(i, t) {
    this.deleteIndex = i;
    this.deleteType = t;
  }

  remove(i, t) {
    if (t == "medication") {
      if (i > -1) {
        this.medicationList.splice(i, 1);
      }
    } else if (t == "lab") {
      if (i > -1) {
        this.labList.splice(i, 1);
      }
    }
    document.getElementById('modal-delete').click();
  }

  onClose() {
    this.pageForm.reset();
  }

}

