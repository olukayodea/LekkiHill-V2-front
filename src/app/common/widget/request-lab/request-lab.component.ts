import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-request-lab',
  templateUrl: './request-lab.component.html',
  styleUrls: ['./request-lab.component.css']
})
export class RequestLabComponent implements OnInit {
  @Input() patient_id: number;
  @Output() refresh = new EventEmitter<any>();

  processing: boolean = false;

  keyword = 'title';
  data = [];
  category_ref: number = 0;
  doctors_report_id: number = 0;

  deleteIndex: number;

  labTestList: { ref: number, title: string, cost: { value: number, label: string } }[] = []

  pageForm = this.fb.group({
    ref: [''],
    l_category: ['', Validators.required]
  });

  get ref() { return this.pageForm.get('ref'); }
  get l_category() { return this.pageForm.get('l_category'); }


  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
  }

  onCreate() {
    let count = 0;
    if (this.labTestList.length > 0) {
      this.labTestList.forEach(element => {
        let array = {};
        array['patient_id'] = this.patient_id;
        array['doctors_report_id'] = this.doctors_report_id;
        array['category_id'] = element.ref;
        this.apiService.recordLabTestAsync(array).then(patientData => {
          if (patientData.success == true) {
            count = count + 1;
          } else {
            this.notifyService.showError(patientData.error.message + " " + patientData.error.additional_message, "Error")
          }
        });
      });

      if (count > 0) {
        this.notifyService.showSuccess("Numbers of Lab test request sent: " + count, "Lab. Test Request");
      }

      this.ngOnInit();
      document.getElementById('modal-post-op').click();
      document.getElementById('modal-medication').click();
      document.getElementById('modal-fluid-balance').click();
      document.getElementById('modal-doctors-report').click();
      document.getElementById('modal-request-lab').click();
      this.pageForm.reset();

      this.refresh.next();
    } else {
      this.notifyService.showError("An error has occured, please check the input data", "Error")
    }
  }

  remove(i) {
    if (i > -1) {
      this.labTestList.splice(i, 1);
    }
  }

  onClose() {
    this.pageForm.reset();
  }

  selectEvent(item) {
    // do something with selected item
    const result = this.labTestList.find(({ ref }) => ref === item.ref);

    if (result === undefined) {
      this.labTestList.push({ref: item.ref, title: item.title, cost: item.cost});
    }

    this.pageForm.reset();
  }


  getIndexFOrMedication(i, t) {
    this.deleteIndex = i;
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    this.apiService.getLabComponentSearch(val).then(labCompData => {
      if (labCompData.success == true) {
        if (labCompData.data.length > 0) {
          this.data = labCompData.data;
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
