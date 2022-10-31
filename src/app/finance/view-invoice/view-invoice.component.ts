import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Counts, MoneyFormat } from 'src/app/_models/data';
import { InvoiceData, OneInvoice } from 'src/app/_models/invoice';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.css']
})
export class ViewInvoiceComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;

  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  view: string = "";

  processing: boolean = false;
  loading: boolean = true;

  success: string;
  successMsg: boolean;
  error: string;
  errorMsg: boolean;

  invoiceData: InvoiceData;

  invoiceRef: number;

  extendForm = this.fb.group({
    amount: ["", Validators.required]
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
    this.invoiceData = new InvoiceData();
  }

  ngOnInit(): void {
    if (this.routeParams['id'] !== undefined) {
      this.invoiceRef = this.routeParams['id'];
    }


    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    } else {
      this.page = 1;
    }
    this.getOneInvoice(this.invoiceRef);

  }

  getOneInvoice(invoiceRef) {
    this.loading = true;

    this.apiService.getOneInvoice(invoiceRef).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.invoiceData = data.data;

          this.extendForm.patchValue({
            amount: this.invoiceData.due.value,
          });
          
          this.amount.setValidators([Validators.max(this.invoiceData.due.value)]);
        } else {
          this.notifyService.showError(data.error.message, "Error")
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
          this.notifyService.showSuccess("Invoice " + this.invoiceData.invoiceNumber +" Removed Successfully", "Invoice Deleted");
           this.router.navigate(['/finance']);
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }

        document.getElementById('modal-delete').click();
      }
    );
  }

  doPost() {
    var data: object = {
      ref: this.invoiceData.ref,
      amount: this.extendForm.value.amount
    };
    this.postPayment(data);
  }

  postPayment(data) {
    this.processing = true;
    this.apiService.postPayment(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Payment posted to Invoice " + user.data.invoiceNumber + " succssfully", "Invoice Updated");
          this.ngOnInit();
          this.extendForm.reset();
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }
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
