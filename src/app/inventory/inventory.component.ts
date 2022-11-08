import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Counts } from '../_models/data';
import { InventoryData } from '../_models/inventory';
import { InventoryCategoryData } from '../_models/inventoryCategory';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;

  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  mainHeader: string = "All Inventories";
  formHeader: string = "Add New Inventory";
  view: string = "";
  searchRowData: string = "";
  query: string = "";

  processing: boolean = false;
  loading: boolean = true;

  buttonText: string = "Add New Inventory";

  inventoryList: InventoryData[] = [];
  inventoryCategoryList: InventoryCategoryData[] = []

  edit: boolean = false;
  searchResult: boolean = false;
  activeActive: boolean = false;
  inactiveActive: boolean = false;
  allActive: boolean = true;

  inventoryName: string;
  inventoryRef: number;

  loginForm = this.fb.group({
    ref: [''],
    title: ['', Validators.required],
    cost: ['', Validators.required],
    qty_desc: ['', Validators.required],
    inventory_added: ['', Validators.required],
    category_id: ['', Validators.required]
  });

  get ref() { return this.loginForm.get('ref'); }
  get title() { return this.loginForm.get('title'); }
  get cost() { return this.loginForm.get('cost'); }
  get qty_desc() { return this.loginForm.get('qty_desc'); }
  get inventory_added() { return this.loginForm.get('inventory_added'); }
  get category_id() { return this.loginForm.get('category_id'); }

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
    this.getActiveInventoryCategory();
  }

  ngOnInit(): void {
    if (this.routeParams['view'] !== undefined) {
      this.view = this.routeParams['view'];
      if (this.view == "active") {
        this.mainHeader = "All Active Inventories";
        this.activeActive = true;
        this.inactiveActive = false;
        this.allActive = false;
      } else if (this.view == "inactive") {
        this.mainHeader = "All Inactive Inventories";
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
    this.getInventory(this.page);
  }


  getActiveInventoryCategory() {
    this.apiService.getActiveInventoryCategory().subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        if (data.success == true) {
          this.inventoryCategoryList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  getInventory(page) {
    this.loading = true;

    this.apiService.getInventory(page, this.view).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.count = data.counts;
          this.inventoryList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  onSearch() {
    this.query = this.searchForm.value.q;
    this.search(this.query, this.page);
    this.mainHeader = "All Inventories";
  }

  onSearchClose() {
    this.searchForm.reset();
    this.searchResult = false;

    this.getInventory(this.page);
  }

  search(q:string, page:number) {
    this.loading = true;

    this.apiService.searchInventory(q, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.searchResult = true;
          this.count = data.counts;
          this.inventoryList = data.data;
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
      title: this.loginForm.value.title,
      cost: this.loginForm.value.cost,
      qty_desc: this.loginForm.value.qty_desc,
      inventory_added: this.loginForm.value.inventory_added,
      category_id: this.loginForm.value.category_id
    };

    if (this.edit === true) {
      data['ref'] = this.loginForm.value.ref;
      this.editInventory(data);
    } else {
      this.createInventory(data);
    }
  }

  createInventory(data) {
    this.processing = true;

    this.buttonText = "Saving...";
    this.apiService.createInventory(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Created " + data.title + " as an Inventory", "Inventory Created");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
        this.buttonText = "Add New Inventory";
      }
    );
  }

  editInventory(data) {
    this.processing = true;

    this.buttonText = "Saving Changes...";
    this.apiService.editInventory(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("saved changes made to inventory", "Inventory Modified");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
        this.buttonText = "Add New Inventory";
        this.edit = false;
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
    this.apiService.changeInventoryStatus(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("saved changes made to Inventory", "Inventory Modified");
          this.ngOnInit();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
      }
    );
  }

  getDataForModal(name:string, ref:number) {
    this.inventoryName = name;
    this.inventoryRef = ref;
  }

  getEdit(data: InventoryData) {
    this.edit = true;
    this.formHeader = "Edit Inventory";

    this.loginForm.patchValue({
      ref: data.ref,
      title: data.title,
      cost: data.cost.value,
      qty_desc: data.qty_desc,
      category_id: data.category.ref
    });

    this.inventory_added.setValidators([]); // or clearValidators()
    this.inventory_added.updateValueAndValidity();

    this.inventoryRef = data.ref;
    this.inventoryName = data.title;

    this.buttonText = "Save Changes";
  }

  onCancel() {
    this.edit = false;
    this.inventory_added.setValidators([Validators.required]);
    this.inventory_added.updateValueAndValidity();
    this.loginForm.reset();
    this.formHeader = this.buttonText = "Add New Inventory";
  }

  deleteInventory(ref:number) {
    this.processing = true;

    this.apiService.deleteInventory(ref).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Category Removed Successfully", "Inventory Deleted");
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
