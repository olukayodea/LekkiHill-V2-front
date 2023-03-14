import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PatientsData } from 'src/app/_models/patients';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { SearchPatientComponent } from '../../search-patient/search-patient.component';

@Component({
  selector: 'app-view-clinic',
  templateUrl: './view-clinic.component.html',
  styleUrls: ['./view-clinic.component.css']
})
export class ViewClinicComponent implements OnInit {
  @ViewChild('searchPatientComponent', { static: false })
  searchPatientComponent: SearchPatientComponent;
  
  patient_id: number;
  patient_name: string;

  constructor(
    private checkService: ChecksService,
    private router: Router,
  ) {
    this.checkService.checkSession();
  }

  ngOnInit(): void {
  }

  getPatientData(data: { id: number, data: PatientsData }) {

    this.searchPatientComponent.clearForm();
    this.patient_id = data.id;
    if (data.id > 1) {
      document.getElementById('modal-view-clinic').click();
      this.router.navigate(['/clinic', data.id]);

    }
  }

  setBusy(value) {
    this.patient_name = value;
  }

}
