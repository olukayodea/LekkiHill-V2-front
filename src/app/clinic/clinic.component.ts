import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { NotificationService } from '../_services/notification.service';
import { Clinic } from '../_models/clinic/data';
import { Counts } from '../_models/data';
import { MedicationsData } from '../_models/clinic/medications';
import { FluidBalanceData } from '../_models/clinic/fluidBalance';
import { PostOpData } from '../_models/clinic/postOp';
import { DoctorsReportData } from '../_models/clinic/doctorsReport';
import { VitalsData } from '../_models/clinic/vitals';

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.css']
})
export class ClinicComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;

  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  processing: boolean = false;
  loading: boolean = true;
  loadingSection: boolean = true;
  
  patientData: Clinic;
  patientRef: number;

  medicationList: MedicationsData[] = [];
  fluidBalanceList: FluidBalanceData[] = [];
  postOpList: PostOpData[] = [];
  doctorsReportList: DoctorsReportData[] = [];
  VitalsList: VitalsData[] = [];

  doctorsReport: boolean = false;
  medications: boolean = false;
  postOp: boolean = false;
  fluidBalance: boolean = false;
  vitals: boolean = false;
  labouratory: boolean = false;

  summaryTab: boolean = true;
  doctorsReportTab: boolean = false;
  medicationsTab: boolean = false;
  postOpTab: boolean = false;
  fluidBalanceTab: boolean = false;
  vitalsTab: boolean = false;
  labouratoryTab: boolean = false;

  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private router: Router,
    private location: Location
  ) {
    this.checkService.checkSession();
    this.getRouteParams();
    this.patientData = new Clinic();
  }

  ngOnInit(): void {
    if (this.routeParams['id'] !== undefined) {
      this.patientRef = this.routeParams['id'];
    } else {
      this.notifyService.showError("Cannot load the content of the page you have requested", "Error")
      this.router.navigate(['/patients']);
    }

    if (this.routeParams['view'] !== undefined) {
      let view = this.routeParams['view'];
      this.switchTab(view + "Tab");
    }

    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    } else {
      this.page = 1;
    }

    this.getOneClinicPatient(this.patientRef);
  }

  
  getOneClinicPatient(invoiceRef) {
    this.loading = true;

    this.apiService.getOneClinicPatient(invoiceRef).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.patientData = data;
          
          this.doctorsReport = (this.patientData.doctorsReport === null) ? false : true;
          this.medications = (this.patientData.medications === null) ? false : true;
          this.postOp = (this.patientData.postOp === null) ? false : true;
          this.fluidBalance = (this.patientData.fluidBalance === null) ? false : true;
          this.vitals = (this.patientData.vitals === null) ? false : true;
          this.labouratory = (this.patientData.labouratory === null) ? false : true;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
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

  stringDivider(str, width) {
    let spaceReplacer = "<br/>\n";
    if (str.length > width) {
      var p = width
      for (; p > 0 && str[p] != ' '; p--) {
      }
      if (p > 0) {
        var left = str.substring(0, p);
        var right = str.substring(p + 1);
        return left + spaceReplacer + this.stringDivider(right, width);
      }
    }
    return str;
  }

  getMedication( page ) {
    this.loadingSection = true;

    this.apiService.getMedication(this.patientRef, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loadingSection = false
        if (data.success == true) {
          this.count = data.counts;
          this.medicationList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  getFluidBalance( page ) {
    this.loadingSection = true;

    this.apiService.getFluidBalance(this.patientRef, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loadingSection = false
        if (data.success == true) {
          this.count = data.counts;
          this.fluidBalanceList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  getPostOp( page ) {
    this.loadingSection = true;

    this.apiService.getPostOp(this.patientRef, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loadingSection = false
        if (data.success == true) {
          this.count = data.counts;
          this.postOpList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  getVitals( page ) {
    this.loadingSection = true;

    this.apiService.getVitals(this.patientRef, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loadingSection = false
        if (data.success == true) {
          this.count = data.counts;
          this.VitalsList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  getDoctorsReport( page ) {
    this.loadingSection = true;

    this.apiService.getDoctorsReport(this.patientRef, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loadingSection = false
        if (data.success == true) {
          this.count = data.counts;
          this.doctorsReportList = data.data;
        } else {
          this.notifyService.showError(data.error.message + " " + data.error.additional_message, "Error")
        }
      }
    );
  }

  switchTab ( tab ) {
    this.loadingSection = true;
    this.page = 1;
    if (tab == "summaryTab") {
      this.summaryTab = true;
      this.doctorsReportTab = false;
      this.medicationsTab = false;
      this.postOpTab = false;
      this.fluidBalanceTab = false;
      this.vitalsTab = false;
      this.labouratoryTab = false;

      this.location.replaceState('/clinic/' + this.patientRef);
    } else if (tab == "doctorsReportTab") {
      this.summaryTab = false;
      this.doctorsReportTab = true;
      this.medicationsTab = false;
      this.postOpTab = false;
      this.fluidBalanceTab = false;
      this.vitalsTab = false;
      this.labouratoryTab = false;
      this.location.replaceState('/clinic/' + this.patientRef + "/doctorsReport");
      this.getDoctorsReport(this.page);
    } else if (tab == "medicationsTab") {
      this.summaryTab = false;
      this.doctorsReportTab = false;
      this.medicationsTab = true;
      this.postOpTab = false;
      this.fluidBalanceTab = false;
      this.vitalsTab = false;
      this.labouratoryTab = false;
      this.location.replaceState('/clinic/' + this.patientRef + "/medications");
      this.getMedication(this.page);
    } else if (tab == "postOpTab") {
      this.summaryTab = false;
      this.doctorsReportTab = false;
      this.medicationsTab = false;
      this.postOpTab = true;
      this.fluidBalanceTab = false;
      this.vitalsTab = false;
      this.labouratoryTab = false;
      this.location.replaceState('/clinic/' + this.patientRef + "/postOp");
      this.getPostOp(this.page);
    } else if (tab == "fluidBalanceTab") {
      this.summaryTab = false;
      this.doctorsReportTab = false;
      this.medicationsTab = false;
      this.postOpTab = false;
      this.fluidBalanceTab = true;
      this.vitalsTab = false;
      this.labouratoryTab = false;
      this.location.replaceState('/clinic/' + this.patientRef + "/fluidBalance");
      this.getFluidBalance(this.page);
    } else if (tab == "vitalsTab") {
      this.summaryTab = false;
      this.doctorsReportTab = false;
      this.medicationsTab = false;
      this.postOpTab = false;
      this.fluidBalanceTab = false;
      this.vitalsTab = true;
      this.labouratoryTab = false;
      this.location.replaceState('/clinic/' + this.patientRef + "/vitals");
      this.getVitals(this.page);
    } else if (tab == "labouratoryTab") {
      this.summaryTab = false;
      this.doctorsReportTab = false;
      this.medicationsTab = false;
      this.postOpTab = false;
      this.fluidBalanceTab = false;
      this.vitalsTab = false;
      this.labouratoryTab = true;
      this.location.replaceState('/clinic/' + this.patientRef + "/labouratory");
    }
  }

}
