import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-fluid-balance',
  templateUrl: './fluid-balance.component.html',
  styleUrls: ['./fluid-balance.component.css']
})
export class FluidBalanceComponent implements OnInit {
  @Input() patient_id: number;
  @Output() refresh = new EventEmitter<any>();
  
  processing: boolean = false;

  pageForm = this.fb.group({
    iv_fluid: ['', Validators.required],
    amount: ['', Validators.required],
    oral_fluid: ['', Validators.required],
    ng_tube_feeding: ['', Validators.required],
    vomit: ['', Validators.required],
    urine: ['', Validators.required],
    drains: ['', Validators.required],
    ng_tube_drainage: ['', Validators.required]
  });
  
  get iv_fluid() { return this.pageForm.get('iv_fluid'); }
  get amount() { return this.pageForm.get('amount'); }
  get oral_fluid() { return this.pageForm.get('oral_fluid'); }
  get ng_tube_feeding() { return this.pageForm.get('ng_tube_feeding'); }
  get vomit() { return this.pageForm.get('vomit'); }
  get urine() { return this.pageForm.get('urine'); }
  get drains() { return this.pageForm.get('drains'); }
  get ng_tube_drainage() { return this.pageForm.get('ng_tube_drainage'); }


  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
  }

  onCreate() {
    var data: object = {
      patient_id: this.patient_id,
      iv_fluid: this.pageForm.value.iv_fluid,
      amount: this.pageForm.value.amount,
      oral_fluid: this.pageForm.value.oral_fluid,
      ng_tube_feeding: this.pageForm.value.ng_tube_feeding,
      vomit: this.pageForm.value.vomit,
      urine: this.pageForm.value.urine,
      drains: this.pageForm.value.drains,
      ng_tube_drainage: this.pageForm.value.ng_tube_drainage,
    };

    this.recordFluidBalance(data);
  }

  recordFluidBalance(data) {
    this.processing = true;

    this.apiService.recordFluidBalance(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Patient's details saved", "Record Saved");
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

}
