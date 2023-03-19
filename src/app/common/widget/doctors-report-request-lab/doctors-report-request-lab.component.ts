import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-doctors-report-request-lab',
  templateUrl: './doctors-report-request-lab.component.html',
  styleUrls: ['./doctors-report-request-lab.component.css']
})
export class DoctorsReportRequestLabComponent implements OnInit {
  @Input() patient_id: number;
  @Output() refresh = new EventEmitter<any>();
  
  processing: boolean = false;

  keyword = 'title';
  data = [];
  category_ref: number = 0;
  doctors_report_id: number = 0;

  deleteIndex: number;

  labTestList: { ref: number, title: string, cost: { value: number, label: string } }[] = []
  sendData : {patient_id: number, doctors_report_id:number, category_id:number}[] = [];

  pageForm = this.fb.group({
    ref: [''],
    l_category: ['', Validators.required]
  });

  get ref() { return this.pageForm.get('ref'); }
  get l_category() { return this.pageForm.get('l_category'); }


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
  }

  onCreate() {
    if (this.labTestList.length > 0) {
      this.labTestList.forEach(element => {
        let array = {
          patient_id: this.patient_id,
          doctors_report_id: this.doctors_report_id,
          category_id: element.ref
        }

        this.sendData.push(array);
        
      });

      this.refresh.next(this.sendData);
    }
    document.getElementById('modal-doctors-report-request-lab').click();
  }

  remove(i) {
    if (i > -1) {
      this.labTestList.splice(i, 1);
    }
  }

  onClose() {
    this.pageForm.reset();
    this.sendData = [];
    console.log(this.sendData);
    this.refresh.next(this.sendData);
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
