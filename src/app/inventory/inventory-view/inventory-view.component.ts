import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Counts } from 'src/app/_models/data';
import { InventoryData } from 'src/app/_models/inventory';
import { InvoiceData } from 'src/app/_models/invoice';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-inventory-view',
  templateUrl: './inventory-view.component.html',
  styleUrls: ['./inventory-view.component.css']
})
export class InventoryViewComponent implements OnInit {

  routeParams: Params;
  queryParams: Params;

  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  view: string = "";
  minimum: number = 50;

  processing: boolean = false;
  loading: boolean = true;

  inventoryData: InventoryData;

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
    this.inventoryData = new InventoryData();
  }

  ngOnInit(): void {
    if (this.routeParams['id'] !== undefined) {
      this.invoiceRef = this.routeParams['id'];
    } else {
      this.notifyService.showError("Cannot load the content of the page you have requested", "Error")
      this.router.navigate(['/finance']);
    }


    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    } else {
      this.page = 1;
    }
    this.getOneInventory(this.invoiceRef);

  }

  getOneInventory(invoiceRef) {
    this.loading = true;

    this.apiService.getOneInventory(invoiceRef).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.inventoryData = data.data;

          // this.extendForm.patchValue({
          //   amount: this.inventoryData.due.value,
          // });
          
          // this.amount.setValidators([Validators.max(this.inventoryData.due.value)]);
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
          this.notifyService.showSuccess("Invoice " + this.inventoryData.sku +" Removed Successfully", "Invoice Deleted");
           this.router.navigate(['/finance']);
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }

        document.getElementById('modal-delete').click();
      }
    );
  }

  doPost() {
    var data: object = {
      ref: this.inventoryData.ref,
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
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
      }
    );
  }

  returnAbsolute( number: number ) {
    return (number < 0) ? "(" + Math.abs(number) + ")" : number;
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
