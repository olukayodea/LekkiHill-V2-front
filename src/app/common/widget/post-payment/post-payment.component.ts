import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MoneyFormat } from 'src/app/_models/data';
import { InvoiceComponentData } from 'src/app/_models/invoiceComponent';
import { PatientsData } from 'src/app/_models/patients';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-post-payment',
  templateUrl: './post-payment.component.html',
  styleUrls: ['./post-payment.component.css']
})
export class PostPaymentComponent implements OnInit {
  @Input() patientData: PatientsData;
  @Output() refresh = new EventEmitter<any>();

  processing: boolean = false;
  loading: boolean = true;
  submit: boolean = false;

  total: number = 0;

  invoiceComponentList: InvoiceComponentData[] = [];
  componentList: {id: number, title: string, cost: MoneyFormat, quantity: number, description:string}[] = [];

  invoiceForm = this.fb.group({
    ref: [''],
    component: ['', Validators.required],
    quantity: ['', Validators.required],
    description: ['', Validators.required]
  });

  get ref() { return this.invoiceForm.get('ref'); }
  get component() { return this.invoiceForm.get('component'); }
  get quantity() { return this.invoiceForm.get('quantity'); }
  get description() { return this.invoiceForm.get('description'); }

  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private notifyService: NotificationService,
  ) {
    this.getInvoiceComponent();
  }

  ngOnInit(): void {
  }

  onClose() {
    this.invoiceForm.reset();
  }


  onCreate() {
    var data: object = {
      patient_id: this.patientData.ref,
      billing_component: this.componentList
    };

    this.createInvoice(data);
  }

  createInvoice(data) {
    this.processing = true;

    this.apiService.createInvoice(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Payment Invoice " + user.data.invoiceNumber + " was created successfully", "Invoice Created");
          this.ngOnInit();
          this.invoiceForm.reset();
          document.getElementById('modal-record-vital').click();
          document.getElementById('modal-schedule-appointment').click();
          document.getElementById('modal-post-payment').click();
          document.getElementById('modal-pending-invoice').click();
          document.getElementById('modal-view-clinic').click();
          this.refresh.next();
          this.componentList = [];
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
      }
    );
  }

  addComponent() {
    let obj:{id: number, title: string, cost: MoneyFormat, quantity: number, description:string} = {
      id: this.invoiceComponentList[this.invoiceForm.value.component].ref,
      title: this.invoiceComponentList[this.invoiceForm.value.component].title,
      cost: this.invoiceComponentList[this.invoiceForm.value.component].cost,
      quantity: this.invoiceForm.value.quantity,
      description: this.invoiceForm.value.description
    }

    this.componentList.push(obj);
    this.componentTotal();
    this.invoiceForm.reset();
  }

  componentTotal() {
    this.total = 0;
    this.componentList.forEach(element => {
      this.total = this.total + (element.cost.value * element.quantity);
    })
    this.checkSubmit();
  }

  checkSubmit() {
    if (this.componentList.length > 0) {
      this.submit = true;
    } else {
      this.submit = false;
    }
  }

  getInvoiceComponent() {
    this.apiService.getActiveInvoiceComponent().subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        if (data.success == true) {
          this.invoiceComponentList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }
}
