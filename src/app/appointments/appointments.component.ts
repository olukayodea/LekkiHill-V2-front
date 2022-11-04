import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { SearchPatientComponent } from '../common/search-patient/search-patient.component';
import { AppointmentsData } from '../_models/appointments';
import { Counts } from '../_models/data';
import { PatientsData } from '../_models/patients';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  @ViewChild('searchPatientComponent', { static: false })
  searchPatientComponent: SearchPatientComponent;

  routeParams: Params;
  queryParams: Params;

  page: number = 1;
  count: Counts;

  date: Date;

  pageUrl = this.router.url.slice(1);

  mainHeader: string = "All Appointments";
  formHeader: string = "Book Appointment";
  view: string = "";
  searchRowData: string = "";
  query: string = "";
  subPage = "schedule";

  allActive: boolean = true;
  cancelledActive: boolean = false;
  newActive: boolean = false;
  scheduledActive: boolean = false;
  filter: boolean = false;

  processing: boolean = false;
  loading: boolean = true;
  submit: boolean = false;
  submitButton: boolean = false;

  buttonText: string = "Schedule";

  appointmentList: AppointmentsData[] = [];
  appointmentsData: AppointmentsData;

  patient_id: number;
  patient_name: string;

  edit: boolean = false;
  searchResult: boolean = false;
  showForm: boolean = false;
  showDetails: boolean = false;

  loginForm = this.fb.group({
    ref: [""],
    names: [""],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    location: ['', Validators.required],
    procedure: ['', Validators.required],
    message: ['', Validators.maxLength(500)],
    next_appointment: ['', Validators.required]
  });

  get ref() { return this.loginForm.get('ref'); }
  get names() { return this.loginForm.get('names'); }
  get email() { return this.loginForm.get('email'); }
  get phone() { return this.loginForm.get('phone'); }
  get location() { return this.loginForm.get('location'); }
  get procedure() { return this.loginForm.get('procedure'); }
  get message() { return this.loginForm.get('message'); }
  get next_appointment() { return this.loginForm.get('next_appointment'); }

  searchForm = this.fb.group({
    q: ['', Validators.required]
  });

  get q() { return this.searchForm.get('q'); }

  extendForm = this.fb.group({
    appointmentDate: ["", Validators.required]
  }, {});
  get appointmentDate() { return this.extendForm.get('appointmentDate'); }

  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private router: Router,
  ) {
    this.checkService.checkSession();
    this.getRouteParams();
    this.appointmentsData = new AppointmentsData();
  }

  ngOnInit(): void {
    if (this.routeParams['view'] !== undefined) {
      this.view = this.routeParams['view'];
      if (this.view == "new") {
        this.mainHeader = "Unscheduled Appointments";
        this.newActive = true;
        this.scheduledActive = false;
        this.cancelledActive = false;
        this.allActive = false;
        this.filter = false;
        this.subPage = "schedule";
      } else if (this.view == "scheduled") {
        this.mainHeader = "Scheduled Appointments";
        this.newActive = false;
        this.scheduledActive = true;
        this.cancelledActive = false;
        this.allActive = false;
        this.filter = false;
        this.subPage = "schedule";
      } else if (this.view == "cancelled") {
        this.mainHeader = "Cancelled Appointment";
        this.newActive = false;
        this.scheduledActive = false;
        this.cancelledActive = true;
        this.allActive = false;
        this.filter = false;
        this.subPage = "schedule";
      } else if (this.view == "past") {
        this.mainHeader = "Past Appointment";
        this.newActive = this.scheduledActive = this.cancelledActive = this.allActive = false;
        this.filter = true;
        this.subPage = this.view;
      } else if (this.view == "upcoming") {
        this.mainHeader = "Upcomming Appointment";
        this.newActive = this.scheduledActive = this.cancelledActive = this.allActive = false;
        this.filter = true;
        this.subPage = this.view;
      } else if (this.view == "today") {
        this.mainHeader = "Today's Appointment";
        this.newActive = this.scheduledActive = this.cancelledActive = this.allActive = false;
        this.filter = true;
        this.subPage = this.view;
      } else {
        this.view = "";
      }
      this.view = this.view.toLowerCase();
    }

    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    } else {
      this.page = 1;
    }
    if (this.filter) {
      this.getFilteredAppointment(this.page);
    } else {
      this.getAppointment(this.page);
    }
    this.date = new Date;
  }

  getData(data: AppointmentsData) {
    this.appointmentsData = data;
  }

  getEdit(data: AppointmentsData) {
    this.edit = true;
    this.showDetails = false;
    this.formHeader = "Edit Appointment";
    console.log(data);
    this.loginForm.patchValue({
      ref: data.ref,
      names: data.names,
      email: data.email,
      phone: data.phone,
      location: data.location,
      procedure: data.procedure,
      message: data.message,
      next_appointment: data.date.next
    });
    this.patient_id = data.patient.ref;
    this.patient_name = data.names;

    this.buttonText = "Save Changes";
  }

  getAppointment(page) {
    this.loading = true;

    this.apiService.getAppointment(page, this.view).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.count = data.counts;
          this.appointmentList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  getFilteredAppointment(page) {
    this.loading = true;

    this.apiService.getFilteredAppointment(page, this.view).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.count = data.counts;
          this.appointmentList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  open(appointmentsData: AppointmentsData) {
    this.appointmentsData = appointmentsData;
    this.showDetails = true;
  }

  schedule() {
    var data: object = {
      appointmentDate: this.extendForm.value.appointmentDate,
      ref: this.appointmentsData.ref
    };

    this.scheduleAppointment(data);

  }

  scheduleAppointment(data) {
    this.processing = true;

    this.apiService.scheduleAppointment(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Appointment for " + this.appointmentsData.names + " was scheduled successfully", "Appointment Created");
          this.ngOnInit();
          this.showDetails = false
          this.open(user.data);
          this.extendForm.reset();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
      }
    );
  }

  getPatientData(data: { id: number, data: PatientsData }) {
    this.patient_id = data.id;
    if (data.id > 1) {

      this.apiService.getPatient(data.id).then(patientData => {
        if (patientData.success == true) {
          this.loginForm.patchValue({
            email: data.data.email,
            phone: data.data.phoneNumber
          });
        } else {
          this.patient_id = 0;
        }
      });

    }
    this.showForm = true;
  }

  setBusy(value) {
    this.showForm = false;
    this.patient_name = value;
  }

  onSearch() {
    this.query = this.searchForm.value.q;
    this.search(this.query, this.page);
  }

  onSearchClose() {
    this.searchForm.reset();
    this.searchResult = false;

    if (this.view == "new") {
      this.mainHeader = "Unscheduled Appointments";
      this.newActive = true;
      this.scheduledActive = false;
      this.cancelledActive = false;
      this.allActive = false;
      this.filter = false;
      this.subPage = "schedule";
    } else if (this.view == "scheduled") {
      this.mainHeader = "Scheduled Appointments";
      this.newActive = false;
      this.scheduledActive = true;
      this.cancelledActive = false;
      this.allActive = false;
      this.filter = false;
      this.subPage = "schedule";
    } else if (this.view == "cancelled") {
      this.mainHeader = "Cancelled Appointment";
      this.newActive = false;
      this.scheduledActive = false;
      this.cancelledActive = true;
      this.allActive = false;
      this.filter = false;
      this.subPage = "schedule";
    } else if (this.view == "past") {
      this.mainHeader = "Past Appointment";
      this.newActive = this.scheduledActive = this.cancelledActive = this.allActive = false;
      this.filter = true;
      this.subPage = this.view;
    } else if (this.view == "upcoming") {
      this.mainHeader = "Upcomming Appointment";
      this.newActive = this.scheduledActive = this.cancelledActive = this.allActive = false;
      this.filter = true;
      this.subPage = this.view;
    } else if (this.view == "today") {
      this.mainHeader = "Today's Appointment";
      this.newActive = this.scheduledActive = this.cancelledActive = this.allActive = false;
      this.filter = true;
      this.subPage = this.view;
    } else {
      this.newActive = false;
      this.scheduledActive = false;
      this.cancelledActive = false;
      this.allActive = true;
      this.view = "";
      this.filter = false;
      this.subPage = "schedule";
    }

    if (this.filter) {
      this.getFilteredAppointment(this.page);
    } else {
      this.getAppointment(this.page);
    }
  }

  getAppointmentPage(page) {
    if (this.filter) {
      this.getFilteredAppointment(page);
    } else {
      this.getAppointment(page);
    }
  }

  search(q: string, page: number) {
    this.loading = true;

    this.apiService.searchAppointment(q, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.searchResult = true;
          this.count = data.counts;
          this.appointmentList = data.data;
          this.mainHeader = "Search Result for '" + q + "'";
          this.searchRowData = (data.data.length > 0 && data.counts.totalRows > 0) ? data.counts.totalRows + " rows(s) found" : "No matching rows found";
          this.searchForm.reset();
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );

  }

  onCreate() {
    var data: object = {
      patient_id: this.patient_id,
      names: this.patient_name,
      email: this.loginForm.value.email,
      phone: this.loginForm.value.phone,
      location: this.loginForm.value.location,
      procedure: this.loginForm.value.procedure,
      message: this.loginForm.value.message,
      next_appointment: this.loginForm.value.next_appointment
    };

    if (this.edit === true) {
      data['ref'] = this.loginForm.value.ref;
      this.editAppointment(data);
    } else {
      this.createAppointment(data);
    }
  }

  createAppointment(data) {
    this.processing = true;

    this.buttonText = "Saving...";
    this.apiService.createAppointment(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Appointment scheduled for " + this.patient_name + " was created successfully", "Appointment Created");
          this.ngOnInit();
          this.loginForm.reset();
          this.searchPatientComponent.clearForm();
          this.showForm = false;
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
        this.buttonText = "Book Appointment";
      }
    );
  }

  editAppointment(data) {
    this.processing = true;

    this.buttonText = "Saving Changes...";
    this.apiService.editAppointment(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("saved changes made to appointmant", "Appointment Modified");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
        this.buttonText = "Book Appointment";
        this.edit = false;
      }
    );
  }

  onCancel() {
    this.edit = false;
    this.loginForm.reset();
    this.formHeader = this.buttonText = "Book Appointment";
  }

  deleteAppointment(appointmentsData: AppointmentsData) {
    this.processing = true;

    this.apiService.deleteAppointment(appointmentsData.ref).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Appointment with " + appointmentsData.names + " Removed Successfully", "Appointment Deleted");
          this.router.navigate(['/appointments']);
          this.showDetails = false;
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }

        document.getElementById('modal-cancel').click();
        document.getElementById('modal-delete').click();
      }
    );
  }

  cancelAppointment(appointmentsData: AppointmentsData) {
    this.processing = true;

    this.apiService.cancelAppointment(appointmentsData.ref).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Appointment with " + appointmentsData.names + " has been cancelled Successfully", "Appointment odified");
          this.router.navigate(['/appointments/cancelled']);
          this.showDetails = false
          this.open(appointmentsData);
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }

        document.getElementById('modal-cancel').click();
        document.getElementById('modal-delete').click();
      }
    );
  }

  getRouteParams() {
    // Route parameters
    this.activatedRoute.params.subscribe(params => {
      this.routeParams = params;
    });

    // URL query parameters
    this.activatedRoute.queryParams.subscribe(params => {
      this.queryParams = params;
    });

    // URL get change
    this.activatedRoute.url.subscribe(url => {
      this.ngOnInit();
    });
  }

  stringDivider(str, width) {
    let spaceReplacer = "<br/>\n";
    if (str.length > width) {
      var p = width
      for (; p > 0 && str[p] != ' '; p--) {
      }
      if (p > 0) {
        var left = str.substring(0, p);
        var right = str.substring(p + 1);
        return left + spaceReplacer + this.stringDivider(right, width);
      }
    }
    return str;
  }
}
