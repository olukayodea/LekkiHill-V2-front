import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Counts } from 'src/app/_models/data';
import { InvoiceComponentData } from 'src/app/_models/invoiceComponent';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-manage-components',
  templateUrl: './manage-components.component.html',
  styleUrls: ['./manage-components.component.css']
})
export class ManageComponentsComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;

  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  mainHeader: string = "All Invoice Components";
  formHeader: string = "Add New Invoice Component";
  searchRowData: string = "";
  query: string = "";

  processing: boolean = false;
  loading: boolean = true;

  success: string;
  successMsg: boolean;
  error: string;
  errorMsg: boolean;

  buttonText: string = "Add New Invoice Component";

  invoiceComponentList: InvoiceComponentData[] = [];

  edit: boolean = false;
  searchResult: boolean = false;

  componentName: string;
  componentRef: number;

  loginForm = this.fb.group({
    ref: [""],
    title: ['', Validators.required],
    cost: ['', Validators.required],
    description: ['', Validators.maxLength(100)]
  });

  get title() { return this.loginForm.get('title'); }
  get cost() { return this.loginForm.get('cost'); }
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
  }

  ngOnInit(): void {
    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    } else {
      this.page = 1;
    }
    this.getInvoiceComponent(this.page);
  }

  getInvoiceComponent(page) {
    this.loading = true;

    this.apiService.getInvoiceComponent(page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.count = data.counts;
          this.invoiceComponentList = data.data;
        } else {
          this.notifyService.showError(data.error.message, "Error")
        }
      }
    );
  }

  onSearch() {
    this.query = this.searchForm.value.q;
    this.search(this.query, this.page);
    this.mainHeader = "All Invoice Components";
  }

  onSearchClose() {
    this.searchForm.reset();
    this.searchResult = false;

    this.getInvoiceComponent(this.page);
  }

  search(q:string, page:number) {
    this.loading = true;

    this.apiService.searchInvoiceComponent(q, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.searchResult = true;
          this.count = data.counts;
          this.invoiceComponentList = data.data;
          this.mainHeader = "Search Result for '" + q + "'";
          this.searchRowData = (data.data.length > 0 && data.counts.totalRows > 0) ? data.counts.totalRows + " rows(s) found" : "No matching rows found";
          this.searchForm.reset();
        } else {
          this.notifyService.showError(data.error.message, "Error")
        }
      }
    );

  }

  onCreate() {
    var data: object = {
      title: this.loginForm.value.title,
      cost: this.loginForm.value.cost,
      description: this.loginForm.value.description
    };

    if (this.edit === true) {
      data['ref'] = this.loginForm.value.ref;

      this.editInvoiceComponent(data);
    } else {
      this.createInvoiceComponent(data);
    }
  }

  createInvoiceComponent(data) {
    this.processing = true;

    this.buttonText = "Saving...";
    this.apiService.createInvoiceComponent(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Created " + data.title + " as a Invoice Component", "Invoice Component Created");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }
        this.buttonText = "Add New Invoice Component";
      }
    );
  }

  editInvoiceComponent(data) {
    this.processing = true;

    this.buttonText = "Saving Changes...";
    this.apiService.editInvoiceComponent(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("saved changes made to Invoice Component", "Invoice Component Modified");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }
        this.buttonText = "Add New Invoice Component";
        this.edit = false;
      }
    );
  }

  onCancel() {
    this.edit = false;
    this.loginForm.reset();
    this.formHeader = this.buttonText = "Add New Invoice Component";
  }

  getDataForModal(name:string, ref:number) {
    this.componentName = name;
    this.componentRef = ref;
  }

  deleteComponent(ref:number) {
    this.processing = true;

    this.apiService.deleteComponent(ref).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Component Removed Successfully", "Billing Component Deleted");
          this.ngOnInit();
        } else {
          this.notifyService.showError(user.error.message, "Error")
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
