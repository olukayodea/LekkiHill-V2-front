import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Counts } from 'src/app/_models/data';
import { InventoryCategoryData } from 'src/app/_models/inventoryCategory';
import { InvoiceComponentData } from 'src/app/_models/invoiceComponent';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-inventory-category',
  templateUrl: './inventory-category.component.html',
  styleUrls: ['./inventory-category.component.css']
})
export class InventoryCategoryComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;

  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  mainHeader: string = "All Inventory Categories";
  formHeader: string = "Add New Inventory Category";
  view: string = "";
  searchRowData: string = "";
  query: string = "";

  processing: boolean = false;
  loading: boolean = true;

  buttonText: string = "Add New Inventory Category";

  categoryList: InventoryCategoryData[] = [];

  searchResult: boolean = false;
  activeActive: boolean = false;
  inactiveActive: boolean = false;
  allActive: boolean = true;

  componentName: string;
  componentRef: number;

  loginForm = this.fb.group({
    title: ['', Validators.required]
  });

  get title() { return this.loginForm.get('title'); }

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
    if (this.routeParams['view'] !== undefined) {
      this.view = this.routeParams['view'];
      if (this.view == "active") {
        this.mainHeader = "All Active Categories";
        this.activeActive = true;
        this.inactiveActive = false;
        this.allActive = false;
      } else if (this.view == "inactive") {
        this.mainHeader = "All Inactive Categories";
        this.activeActive = false;
        this.inactiveActive = true;
        this.allActive = false;
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
    this.getInventoryCategory(this.page);
  }

  getInventoryCategory(page) {
    this.loading = true;

    this.apiService.getInventoryCategory(page, this.view).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.count = data.counts;
          this.categoryList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  onSearch() {
    this.query = this.searchForm.value.q;
    this.search(this.query, this.page);
    this.mainHeader = "All Inventory Categories";
  }

  onSearchClose() {
    this.searchForm.reset();
    this.searchResult = false;

    this.getInventoryCategory(this.page);
  }

  search(q:string, page:number) {
    this.loading = true;

    this.apiService.searchInventoryCategory(q, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.searchResult = true;
          this.count = data.counts;
          this.categoryList = data.data;
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
      title: this.loginForm.value.title
    };

    this.createInventoryCategory(data);
  }

  createInventoryCategory(data) {
    this.processing = true;

    this.buttonText = "Saving...";
    this.apiService.createInventoryCategory(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Created " + data.title + " as an Inventory Category", "Inventory Category Created");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
        this.buttonText = "Add New Inventory Category";
      }
    );
  }

  changeStatus(ref:number, status:string) {
    this.processing = true;

    this.buttonText = "Saving Changes...";
    let data: object = {
      ref: ref,
      status: status
    }
    this.apiService.changeInventoryCategoryStatus(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("saved changes made to Inventory Category", "Inventory Category Modified");
          this.ngOnInit();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
      }
    );
  }

  getDataForModal(name:string, ref:number) {
    this.componentName = name;
    this.componentRef = ref;
  }

  deleteInventoryComponent(ref:number) {
    this.processing = true;

    this.apiService.deleteInventoryComponent(ref).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Category Removed Successfully", "Inventory Category Deleted");
          this.ngOnInit();
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
