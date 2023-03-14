import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Counts } from 'src/app/_models/data';
import { LabComponentData } from 'src/app/_models/labComponent';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css']
})
export class ComponentComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;

  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  mainHeader: string = "All Lab. Components";
  formHeader: string = "Add New Lab. Component";
  searchRowData: string = "";
  query: string = "";

  processing: boolean = false;
  loading: boolean = true;

  buttonText: string = "Add New Lab. Component";

  labComponentList: LabComponentData[] = [];

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
    this.getLabComponent(this.page);
  }

  getLabComponent(page) {
    this.loading = true;

    this.apiService.getLabComponent(page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.count = data.counts;
          this.labComponentList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  onSearch() {
    this.query = this.searchForm.value.q;
    this.search(this.query, this.page);
    this.mainHeader = "All Lab. Components";
  }

  onSearchClose() {
    this.searchForm.reset();
    this.searchResult = false;

    this.getLabComponent(this.page);
  }

  search(q:string, page:number) {
    this.loading = true;

    this.apiService.searchLabComponent(q, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.searchResult = true;
          this.count = data.counts;
          this.labComponentList = data.data;
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
      description: this.loginForm.value.description
    };

    if (this.edit === true) {
      data['ref'] = this.loginForm.value.ref;

      this.editLabComponent(data);
    } else {
      this.createLabComponent(data);
    }
  }

  createLabComponent(data) {
    this.processing = true;

    this.buttonText = "Saving...";
    this.apiService.createLabComponent(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Created " + data.title + " as a Lab. Component", "Lab. Component Created");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
        this.buttonText = "Add New Lab. Component";
      }
    );
  }

  getEdit(data: LabComponentData) {
    this.edit = true;
    this.formHeader = "Edit Lab. Component";

    this.loginForm.patchValue({
      ref: data.ref,
      title: data.title,
      cost: data.cost.value,
      description: data.description,
    });

    this.componentRef = data.ref;
    this.componentName = data.title;

    this.buttonText = "Save Changes";
  }

  editLabComponent(data) {
    this.processing = true;

    this.buttonText = "Saving Changes...";
    this.apiService.editLabComponent(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("saved changes made to Lab. Component", "Lab. Component Modified");
          this.ngOnInit();
          this.loginForm.reset();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
        this.buttonText = "Add New Lab. Component";
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
    this.apiService.changeLabComponentStatus(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("saved changes made to Lab. Component", "Lab. Component Modified");
          this.ngOnInit();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
      }
    );
  }

  onCancel() {
    this.edit = false;
    this.loginForm.reset();
    this.formHeader = this.buttonText = "Add New Lab. Component";
  }

  getDataForModal(name:string, ref:number) {
    this.componentName = name;
    this.componentRef = ref;
  }

  deleteComponent(ref:number) {
    this.processing = true;

    this.apiService.deleteLabComponent(ref).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Component Removed Successfully", "Lab Component Deleted");
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
