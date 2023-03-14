import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-post-op',
  templateUrl: './post-op.component.html',
  styleUrls: ['./post-op.component.css']
})
export class PostOpComponent implements OnInit {
  @Input() patient_id: number;
  @Output() refresh = new EventEmitter<any>();
  
  processing: boolean = false;

  pageForm = this.fb.group({
    surgery: ['', Validators.required],
    surgery_category: ['', Validators.required],
    indication: ['', Validators.required],
    surgeon: ['', Validators.required],
    asst_surgeon: ['', Validators.required],
    per_op_nurse: ['', Validators.required],
    circulating_nurse: ['', Validators.required],
    anaesthesia: ['', Validators.required],
    anaesthesia_time: ['', Validators.required],
    knife_on_skin: ['', Validators.required],
    infiltration_time: ['', Validators.required],
    liposuction_time: ['', Validators.required],
    end_of_surgery: ['', Validators.required],
    procedure: ['', Validators.required],
    amt_of_fat_right: ['', Validators.required],
    amt_of_fat_left: ['', Validators.required],
    amt_of_fat_other: ['', Validators.required],
    ebl: ['', Validators.required],
    plan: ['', Validators.required]
  });

  get surgery() { return this.pageForm.get('surgery'); }
  get surgery_category() { return this.pageForm.get('surgery_category'); }
  get indication() { return this.pageForm.get('indication'); }
  get surgeon() { return this.pageForm.get('surgeon'); }
  get asst_surgeon() { return this.pageForm.get('asst_surgeon'); }
  get per_op_nurse() { return this.pageForm.get('per_op_nurse'); }
  get circulating_nurse() { return this.pageForm.get('circulating_nurse'); }
  get anaesthesia() { return this.pageForm.get('anaesthesia'); }
  get anaesthesia_time() { return this.pageForm.get('anaesthesia_time'); }
  get knife_on_skin() { return this.pageForm.get('knife_on_skin'); }
  get infiltration_time() { return this.pageForm.get('infiltration_time'); }
  get liposuction_time() { return this.pageForm.get('liposuction_time'); }
  get end_of_surgery() { return this.pageForm.get('end_of_surgery'); }
  get procedure() { return this.pageForm.get('procedure'); }
  get amt_of_fat_right() { return this.pageForm.get('amt_of_fat_right'); }
  get amt_of_fat_left() { return this.pageForm.get('amt_of_fat_left'); }
  get amt_of_fat_other() { return this.pageForm.get('amt_of_fat_other'); }
  get ebl() { return this.pageForm.get('ebl'); }
  get plan() { return this.pageForm.get('plan'); }


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
      surgery: this.pageForm.value.surgery,
      surgery_category: this.pageForm.value.surgery_category,
      indication: this.pageForm.value.indication,
      surgeon: this.pageForm.value.surgeon,
      asst_surgeon: this.pageForm.value.asst_surgeon,
      per_op_nurse: this.pageForm.value.per_op_nurse,
      circulating_nurse: this.pageForm.value.circulating_nurse,
      anaesthesia: this.pageForm.value.anaesthesia,
      anaesthesia_time: this.pageForm.value.anaesthesia_time,
      knife_on_skin: this.pageForm.value.knife_on_skin,
      infiltration_time: this.pageForm.value.infiltration_time,
      liposuction_time: this.pageForm.value.liposuction_time,
      end_of_surgery: this.pageForm.value.end_of_surgery,
      procedure: this.pageForm.value.procedure,
      amt_of_fat_right: this.pageForm.value.amt_of_fat_right,
      amt_of_fat_left: this.pageForm.value.amt_of_fat_left,
      amt_of_fat_other: this.pageForm.value.amt_of_fat_other,
      ebl: this.pageForm.value.ebl,
      plan: this.pageForm.value.plan,
    };

    this.recordPostop(data);
  }

  recordPostop(data) {
    this.processing = true;

    this.apiService.recordPostop(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Patient's details saved", "Record Saved");
          this.ngOnInit();
          document.getElementById('modal-post-op').click();
          document.getElementById('modal-medication').click();
          document.getElementById('modal-fluid-balance').click();
          document.getElementById('modal-doctors-report').click();
          document.getElementById('modal-request-lab').click();
          this.pageForm.reset();

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
