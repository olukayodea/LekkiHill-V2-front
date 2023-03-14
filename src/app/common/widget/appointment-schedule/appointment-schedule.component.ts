import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { VitalsData } from 'src/app/_models/clinic/vitals';
import { PatientsData } from 'src/app/_models/patients';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-appointment-schedule',
  templateUrl: './appointment-schedule.component.html',
  styleUrls: ['./appointment-schedule.component.css']
})
export class AppointmentScheduleComponent implements OnInit {
  @Input() patientData: PatientsData;
  @Output() refresh = new EventEmitter<any>();

  date: Date;

  vitalData: VitalsData;
  processing: boolean = false;

  vitalForm = this.fb.group({
    location: ['', Validators.required],
    procedure: ['', Validators.required],
    message: ['', Validators.maxLength(500)],
    next_appointment: ['', Validators.required]
  });

  get location() { return this.vitalForm.get('location'); }
  get procedure() { return this.vitalForm.get('procedure'); }
  get message() { return this.vitalForm.get('message'); }
  get next_appointment() { return this.vitalForm.get('next_appointment'); }

  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.date = new Date;
  }

  onClose() {
    this.vitalForm.reset();
  }
  

  onCreate() {
    var data: object = {
      patient_id: this.patientData.ref,
      names: this.patientData.lastName + " " + this.patientData.firstName,
      email: this.patientData.email,
      phone: this.patientData.phoneNumber,
      location: this.vitalForm.value.location,
      procedure: this.vitalForm.value.procedure,
      message: this.vitalForm.value.message,
      next_appointment: this.vitalForm.value.next_appointment
    };

    this.createAppointment(data);
  }

  createAppointment(data) {
    this.processing = true;

    this.apiService.createAppointment(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Appointment scheduled for " + this.patientData.lastName + " " + this.patientData.firstName, "Appointment Created");
          this.ngOnInit();
          this.vitalForm.reset();
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
