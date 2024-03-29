import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css']
})
export class MedicationComponent implements OnInit {
  @Input() patient_id: number;
  @Output() refresh = new EventEmitter<any>();
  
  processing: boolean = false;

  keyword = 'title';
  data = [];
  medication_title: string = "";
  doctors_report_id: number = 0;

  pageForm = this.fb.group({
    inventory_id: [''],
    m_route: ['', Validators.required],
    quantity: ['', Validators.required],
    m_medication: ['', Validators.required],
    sales_status: ['', Validators.required],
    m_dose: ['', Validators.required],
    m_frequency: ['', Validators.required]
  });

  get inventory_id() { return this.pageForm.get('inventory_id'); }
  get m_route() { return this.pageForm.get('m_route'); }
  get quantity() { return this.pageForm.get('quantity'); }
  get sales_status() { return this.pageForm.get('sales_status'); }
  get m_medication() { return this.pageForm.get('m_medication'); }
  get m_dose() { return this.pageForm.get('m_dose'); }
  get m_frequency() { return this.pageForm.get('m_frequency'); }


  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
  }

  onCreate() {
    let medication = "";
    if (this.medication_title == "") {
      medication = this.pageForm.value.m_medication;
    } else {
      medication = this.medication_title;
    }
    var data: object = {
      patient_id: this.patient_id,
      doctors_report_id: this.doctors_report_id,
      inventory_id: this.pageForm.value.inventory_id,
      quantity: this.pageForm.value.quantity,
      sales_status: this.pageForm.value.sales_status,
      route: this.pageForm.value.m_route,
      medication: medication,
      dose: this.pageForm.value.m_dose,
      frequency: this.pageForm.value.m_frequency
    };

    this.recordMedication(data);
  }

  recordMedication(data) {
    this.processing = true;

    this.apiService.recordMedication(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Patient's details saved", "Medications Saved");
          this.ngOnInit();
          this.pageForm.reset();
          document.getElementById('modal-post-op').click();
          document.getElementById('modal-medication').click();
          document.getElementById('modal-fluid-balance').click();
          document.getElementById('modal-doctors-report').click();
          document.getElementById('modal-request-lab').click();

          this.refresh.next();
        } else {
          this.notifyService.showError(user.error.message + " " + user.error.additional_message, "Error")
        }
      }
    );
  }

  onClose() {
    this.pageForm.reset();
  }
  selectEvent(item) {
    // do something with selected item
    this.pageForm.patchValue({
      inventory_id: item.ref
    });

    this.medication_title = item.title
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.

    this.pageForm.patchValue({
      inventory_id: 0
    });
    this.medication_title = "";
    this.apiService.getInventorySearch(val).then(inventoryData => {
      if (inventoryData.success == true) {
        if (inventoryData.data.length > 0) {
          this.data = inventoryData.data;
        }
      } else {
        this.data = [];
      }
    });
  }
  
  onFocused(e){
    // do something when input is focused
  }

}
