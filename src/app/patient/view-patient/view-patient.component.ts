import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Counts } from 'src/app/_models/data';
import { InventoryData } from 'src/app/_models/inventory';
import { PatientsData } from 'src/app/_models/patients';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css']
})
export class ViewPatientComponent implements OnInit {

  routeParams: Params;
  queryParams: Params;

  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  view: string = "";
  minimum: number = 50;

  processing: boolean = false;
  loading: boolean = true;

  appointment: boolean = true;
  invoices: boolean = false;
  medication: boolean = false;
  dueInvoice: boolean = false;

  patientData: PatientsData;

  invoiceRef: number;

  extendForm = this.fb.group({
    amount: ["", [Validators.required, Validators.min(this.minimum)]]
  }, {});
  get amount() { return this.extendForm.get('amount'); }

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
    this.patientData = new PatientsData();
  }

  ngOnInit(): void {
    if (this.routeParams['id'] !== undefined) {
      this.invoiceRef = this.routeParams['id'];
    } else {
      this.notifyService.showError("Cannot load the content of the page you have requested", "Error")
      this.router.navigate(['/patients']);
    }

    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    } else {
      this.page = 1;
    }
    this.getOnePatient(this.invoiceRef);
  }

  checkPendingInvoice() {
    if (this.patientData.flags.pendingInvoice === true) {
      this.dueInvoice = true;
    } else {
      this.dueInvoice = false;
    }
  }

  getOnePatient(invoiceRef) {
    this.loading = true;

    this.apiService.getOnePatient(invoiceRef).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.patientData = data.data;
          this.checkPendingInvoice();
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }
  
  deleteInvoice() {
    this.processing = true;

    this.apiService.deleteInvoice(this.invoiceRef).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Invoice " + this.patientData.lastName + " " + this.patientData.firstName + " Removed Successfully", "Invoice Deleted");
           this.router.navigate(['/finance']);
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }

        document.getElementById('modal-delete').click();
      }
    );
  }


  changeTab(view:string) {
    if (view == 'appointment') {
      this.appointment = true;
      this.invoices = false;
      this.medication = false;
    } else if (view == 'invoices') {
      this.appointment = false;
      this.invoices = true;
      this.medication = false;
    } else if (view == 'medication') {
      this.appointment = false;
      this.invoices = false;
      this.medication = true;
    } else {
      this.appointment = true;
      this.invoices = false;
      this.medication = false;
    }
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
