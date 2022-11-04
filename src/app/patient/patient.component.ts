import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Counts } from '../_models/data';
import { PatientsData } from '../_models/patients';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;

  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  mainHeader: string = "All Patients";
  formHeader: string = "Add New Patient";
  view: string = "";
  searchRowData: string = "";
  query: string = "";

  processing: boolean = false;
  loading: boolean = true;

  buttonText: string = "Add New Patient";

  patientList: PatientsData[] = [];

  edit: boolean = false;
  searchResult: boolean = false;

  date: Date;

  loginForm = this.fb.group({
    ref: [""],
    last_name: ['', Validators.required],
    first_name: ['', Validators.required],
    age: ['', Validators.required],
    phone_number: ['', Validators.required],
    sex: ['', Validators.required],
    email: ['', Validators.required],
    address: ['', Validators.required],
    next_of_Kin: ['', Validators.required],
    next_of_contact: ['', Validators.required],
    next_of_address: ['', Validators.required],
    allergies: ['', Validators.required]
  });

  get ref() { return this.loginForm.get('ref'); }
  get last_name() { return this.loginForm.get('last_name'); }
  get first_name() { return this.loginForm.get('first_name'); }
  get age() { return this.loginForm.get('age'); }
  get phone_number() { return this.loginForm.get('phone_number'); }
  get sex() { return this.loginForm.get('sex'); }
  get email() { return this.loginForm.get('email'); }
  get address() { return this.loginForm.get('address'); }
  get next_of_Kin() { return this.loginForm.get('next_of_Kin'); }
  get next_of_contact() { return this.loginForm.get('next_of_contact'); }
  get next_of_address() { return this.loginForm.get('next_of_address'); }
  get allergies() { return this.loginForm.get('allergies'); }

  searchForm = this.fb.group({
    q: ['', Validators.required]
  });

  get q() { return this.searchForm.get('q'); }


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
  }

  ngOnInit(): void {
    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    } else {
      this.page = 1;
    }
    this.getPatients(this.page);
    this.date = new Date;
  }

  getPatients(page) {
    this.loading = true;

    this.apiService.getPatients(page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.count = data.counts;
          this.patientList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  onSearch() {
    this.query = this.searchForm.value.q;
    this.search(this.query, this.page);
  }

  onSearchClose() {
    this.searchForm.reset();
    this.searchResult = false;
    this.mainHeader = "All Patients";
    this.getPatients(this.page);
  }

  search(q:string, page:number) {
    this.loading = true;

    this.apiService.searchPatients(q, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.searchResult = true;
          this.count = data.counts;
          this.patientList = data.data;
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
      last_name: this.loginForm.value.title,
      first_name: this.loginForm.value.first_name,
      age: this.loginForm.value.age,
      phone_number: this.loginForm.value.phone_number,
      sex: this.loginForm.value.sex,
      email: this.loginForm.value.email,
      address: this.loginForm.value.address,
      next_of_Kin: this.loginForm.value.next_of_Kin,
      next_of_contact: this.loginForm.value.next_of_contact,
      next_of_address: this.loginForm.value.next_of_address,
      allergies: this.loginForm.value.allergies
    };

    if (this.edit === true) {
      data['ref'] = this.loginForm.value.ref;

      this.editPatient(data);
    } else {
      this.createPatient(data);
    }
  }

  createPatient(data) {
    this.processing = true;

    this.buttonText = "Saving...";
    this.apiService.createPatient(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Created " + data.title + " as a Patient", "Patient Created");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
        this.buttonText = "Add New Patient";
      }
    );
  }

  editPatient(data) {
    this.processing = true;

    this.buttonText = "Saving Changes...";
    this.apiService.editPatient(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("saved changes made to Patient", "Patient Modified");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
        this.buttonText = "Add New Patient";
        this.edit = false;
      }
    );
  }

  onCancel() {
    this.edit = false;
    this.loginForm.reset();
    this.formHeader = this.buttonText = "Add New Patient";
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

}
