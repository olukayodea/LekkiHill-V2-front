import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Counts, MoneyFormat } from '../_models/data';
import { InvoiceData } from '../_models/invoice';
import { InvoiceComponentData } from '../_models/invoiceComponent';
import { PatientsData } from '../_models/patients';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;

  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  mainHeader: string = "All Invoices";
  formHeader: string = "Create Invoice";
  view: string = "";
  searchRowData: string = "";
  query: string = "";

  allActive: boolean = true;
  paidActive: boolean = false;
  unpaidActive: boolean = false;
  partialActive: boolean = false;

  processing: boolean = false;
  loading: boolean = true;
  submit: boolean = false;
  submitButton: boolean = false;

  buttonText: string = "Add New Invoice";

  invoiceList: InvoiceData[] = [];
  invoiceComponentList: InvoiceComponentData[] = [];
  componentList: {id: number, title: string, cost: MoneyFormat, quantity: number, description:string}[] = [];
  total: number = 0;

  patient_id:number;

  edit: boolean = false;
  searchResult: boolean = false;
  showForm: boolean = false;

  loginForm = this.fb.group({
    ref: [""],
    componentId: ['', Validators.required],
    quantity: ['', Validators.required],
    description: ['', Validators.required]
  });

  get ref() { return this.loginForm.get('ref'); }
  get componentId() { return this.loginForm.get('componentId'); }
  get quantity() { return this.loginForm.get('quantity'); }
  get description() { return this.loginForm.get('description'); }

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
    this.getInvoiceComponent();
  }

  ngOnInit(): void {

    if (this.routeParams['view'] !== undefined) {
      this.view = this.routeParams['view'];
      if (this.view == "UnPaid") {
        this.mainHeader = "Unpaid Invoices";
        this.unpaidActive = true;
        this.partialActive = false;
        this.paidActive = false;
        this.allActive = false;
      } else if (this.view == "partiallyPaid") {
        this.mainHeader = "Partially Paid Invoices";
        this.unpaidActive = false;
        this.partialActive = true;
        this.paidActive = false;
        this.allActive = false;
      } else if (this.view == "Paid") {
        this.mainHeader = "Paid Invoices";
        this.unpaidActive = false;
        this.partialActive = false;
        this.paidActive = true;
        this.allActive = false;
      } else {
        this.view = "UnPaid";
        this.mainHeader = "Unpaid Invoices";
        this.unpaidActive = true;
        this.partialActive = false;
        this.paidActive = false;
        this.allActive = false;
      }
      this.view = this.view.toLowerCase();
    }

    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    } else {
      this.page = 1;
    }
    this.getInvoice(this.page);
    this.checkSubmit();
  }

  getInvoice(page) {
    this.loading = true;

    this.apiService.getInvoice(page, this.view).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.count = data.counts;
          this.invoiceList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  getPatientData( data:{id:number, data:PatientsData} ) {
    console.log(data);
    this.patient_id = data.id;
    if (data.id > 1) {
      this.submitButton = true;
    }
    this.showForm = true;
  }

  setBusy() {
    this.showForm = false;
  }

  addComponent() {
    let obj:{id: number, title: string, cost: MoneyFormat, quantity: number, description:string} = {
      id: this.invoiceComponentList[this.loginForm.value.componentId].ref,
      title: this.invoiceComponentList[this.loginForm.value.componentId].title,
      cost: this.invoiceComponentList[this.loginForm.value.componentId].cost,
      quantity: this.loginForm.value.quantity,
      description: this.loginForm.value.description
    }

    this.componentList.push(obj);
    this.componentTotal();
    this.loginForm.reset();
  }

  componentTotal() {
    this.total = 0;
    this.componentList.forEach(element => {
      this.total = this.total + (element.cost.value * element.quantity);
    })
    this.checkSubmit();
  }

  getInvoiceComponent() {
    this.apiService.getActiveInvoiceComponent().subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        if (data.success == true) {
          this.count = data.counts;
          this.invoiceComponentList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  checkSubmit() {
    if (this.componentList.length > 0) {
      this.submit = true;
    } else {
      this.submit = false;
    }
  }

  onSearch() {
    this.query = this.searchForm.value.q;
    this.search(this.query, this.page);
  }

  onSearchClose() {
    this.searchForm.reset();
    this.searchResult = false;

    if (this.view == "UnPaid") {
      this.mainHeader = "Unpaid Invoices";
      this.unpaidActive = true;
      this.partialActive = false;
      this.paidActive = false;
      this.allActive = false;
    } else if (this.view == "partiallyPaid") {
      this.mainHeader = "Partially Paid Invoices";
      this.unpaidActive = false;
      this.partialActive = true;
      this.paidActive = false;
      this.allActive = false;
    } else if (this.view == "Paid") {
      this.mainHeader = "List Paid Invoices";
      this.unpaidActive = false;
      this.partialActive = false;
      this.paidActive = true;
      this.allActive = false;
    } else {
      this.mainHeader = "All Invoices";
      this.unpaidActive = false;
      this.partialActive = false;
      this.paidActive = false;
      this.allActive = true;
    }
    this.getInvoice(this.page);
  }

  search(q:string, page:number) {
    this.loading = true;

    this.apiService.searchInvoice(q, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.searchResult = true;
          this.count = data.counts;
          this.invoiceList = data.data;
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
      billing_component: this.componentList
    };
    console.log(data);

    if (this.edit === true) {
      data['ref'] = this.loginForm.value.ref;

      this.editPatient(data);
    } else {
      this.createInvoice(data);
    }
  }

  createInvoice(data) {
    this.processing = true;

    this.buttonText = "Saving...";
    this.apiService.createInvoice(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Payment Invoice " + user.data.invoiceNumber + " was created successfully", "Invoice Created");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
        this.buttonText = "Create Invoice";
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
          this.notifyService.showSuccess("saved changes made to Invoice", "Invoice Modified");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
        this.buttonText = "Create Invoice";
        this.edit = false;
      }
    );
  }

  onCancel() {
    this.edit = false;
    this.loginForm.reset();
    this.formHeader = this.buttonText = "Create Invoice";
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
