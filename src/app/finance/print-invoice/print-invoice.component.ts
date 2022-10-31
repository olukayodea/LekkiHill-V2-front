import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { exit } from 'process';
import { InvoiceData } from 'src/app/_models/invoice';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.css']
})
export class PrintInvoiceComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;
  invoiceData: InvoiceData;

  invoiceRef: number;

  constructor(
    private checkService: ChecksService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private notifyService: NotificationService,
  ) {
    this.checkService.checkSession();
    this.getRouteParams();
    this.invoiceData = new InvoiceData();
  }

  ngOnInit(): void {
    if (this.routeParams['id'] !== undefined) {
      this.invoiceRef = this.routeParams['id'];
    }
    this.getOneInvoice(this.invoiceRef);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getOneInvoice(invoiceRef) {

    this.apiService.getOneInvoice(invoiceRef).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        if (data.success == true) {
          this.invoiceData = data.data;

          (async () => {
            await this.delay(4000);
            window.print()
            exit;
          })();
        } else {
          this.notifyService.showError(data.error.message, "Error")
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
