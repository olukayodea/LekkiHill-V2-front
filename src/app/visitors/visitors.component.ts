import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Counts } from '../_models/data';
import { PatientsData } from '../_models/patients';
import { VisitorsData } from '../_models/visitors';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.css']
})
export class VisitorsComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;

  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  mainHeader: string = "All Visitors";
  formHeader: string = "Add New Visitor";
  view: string = "";
  searchRowData: string = "";
  query: string = "";

  processing: boolean = false;
  loading: boolean = true;

  buttonText: string = "Add New Visitor";

  visitorsList: VisitorsData[] = [];
  visitorsData: VisitorsData;

  searchResult: boolean = false;
  showDetails: boolean = false;

  date: Date;


  loginForm = this.fb.group({
    last_name: ['', Validators.required],
    first_name: ['', Validators.required],
    phone_number: ['', Validators.required],
    email: ['', Validators.required],
    address: ['', Validators.required],
    whom_to_see: ['', Validators.required],
    resason: ['', Validators.required]
  });

  get last_name() { return this.loginForm.get('last_name'); }
  get first_name() { return this.loginForm.get('first_name'); }
  get phone_number() { return this.loginForm.get('phone_number'); }
  get email() { return this.loginForm.get('email'); }
  get address() { return this.loginForm.get('address'); }
  get whom_to_see() { return this.loginForm.get('whom_to_see'); }
  get resason() { return this.loginForm.get('resason'); }

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
    this.visitorsData = new VisitorsData();
  }

  ngOnInit(): void {
    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    } else {
      this.page = 1;
    }
    this.getVisitors(this.page);
    this.date = new Date;
  }

  open(visitorsData: VisitorsData) {
    this.visitorsData = visitorsData;
    this.showDetails = true;
  }

  getData(data: VisitorsData) {
    this.visitorsData = data;
  }

  getVisitors(page) {
    this.loading = true;

    this.apiService.getVisitors(page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.count = data.counts;
          this.visitorsList = data.data;
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
    this.mainHeader = "All Visitors";
    this.getVisitors(this.page);
  }

  search(q:string, page:number) {
    this.loading = true;

    this.apiService.searchVisitors(q, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.searchResult = true;
          this.count = data.counts;
          this.visitorsList = data.data;
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
      phone_number: this.loginForm.value.phone_number,
      email: this.loginForm.value.email,
      address: this.loginForm.value.address,
      whom_to_see: this.loginForm.value.whom_to_see,
      resason: this.loginForm.value.resason
    };

      this.createVisitor(data);
  }

  createVisitor(data) {
    this.processing = true;

    this.buttonText = "Saving...";
    this.apiService.createVisitor(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Added " + data.title + " to the visitors' log", "visitor Created");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
        this.buttonText = "Add New Visitor";
      }
    );
  }

  deleteVisitor(visitorsData: VisitorsData) {
    this.processing = true;

    this.apiService.deleteVisitor(visitorsData.ref).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Visitor entry for " + visitorsData.lastName + " " + visitorsData.firstName + " Removed Successfully", "Visitor Deleted");
          this.ngOnInit();
          this.router.navigate(['/visitors']);
          this.showDetails = false;
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }

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

}
