import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { VitalsData } from 'src/app/_models/clinic/vitals';
import { InvoiceData } from 'src/app/_models/invoice';
import { PatientsData } from 'src/app/_models/patients';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-pending-invoice',
  templateUrl: './pending-invoice.component.html',
  styleUrls: ['./pending-invoice.component.css']
})
export class PendingInvoiceComponent implements OnInit {
  @Input() patientData: PatientsData;
  @Output() refresh = new EventEmitter<any>();

  date: Date;

  vitalData: VitalsData;
  processing: boolean = false;

  invoice: InvoiceData[] = [];

  postInvoiceForm = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.date = new Date;

    this.getPending( this.patientData.invoice );

    this.invoice.forEach(x=>{
      this.postInvoiceForm.addControl(x.ref.toString(), new FormControl(x.due.value, [Validators.required, Validators.max(x.due.value)]))
     })
  }

  onClose() {
    this.postInvoiceForm.reset();
  }

  getPending( invoice: InvoiceData[]) {
    invoice.forEach( val => {
      if (val.due.value > 0) {
        this.invoice.push( val );
      }
    })
  }
  

  onCreate() {
    let data = this.postInvoiceForm?.value;
    let result = [];

    Object.keys(data).forEach((key:string)=>{
      result.push( {ref: key, amount: data[key]} );
    });
    
    this.postMultiPayment(result);

  }

  postMultiPayment(data) {
    this.processing = true;
    this.apiService.postMultiPayment(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Payment posted for " + user.data.length + " Invoice(s) succssfully", "Invoice Updated");
          this.ngOnInit();
          this.postInvoiceForm.reset();
          document.getElementById('modal-record-vital').click();
          document.getElementById('modal-schedule-appointment').click();
          document.getElementById('modal-post-payment').click();
          document.getElementById('modal-pending-invoice').click();
          document.getElementById('modal-view-clinic').click();
          this.refresh.next();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
      }
    );
  }


}
