import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Counts } from 'src/app/_models/data';
import { PatientsData } from 'src/app/_models/patients';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search-patient.component.html',
  styleUrls: ['./search-patient.component.css']
})
export class SearchPatientComponent implements OnInit, OnChanges {
  routeParams: Params;
  queryParams: Params;

  @Output() refresh = new EventEmitter<any>();
  @Output() busy = new EventEmitter<any>();

  url = this.router.url.slice(1);

  page: number = 1;
  count: Counts;
  totalRows: number = 0;

  searchSttring: string = "";
  showSearchSttring: boolean = false;

  patientList: PatientsData[] = [];
  patientsData: PatientsData;
  loading: boolean = false;

  searchForm = this.fb.group({
    query: ['', Validators.required]
  });

  get query() { return this.searchForm.get('query'); }

  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.checkService.checkSession();
    this.getRouteParams();
  }

  ngOnInit(): void {
    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    } else {
      this.page = 1;
    }

    this.query.valueChanges.subscribe(selectedValue => {
      if (selectedValue !== null) {
        this.busy.next(selectedValue);
        this.searchSttring = selectedValue;
        this.showSearchSttring = true;
        this.searchPatients(this.searchSttring, 1);
      }
    })
  }

  respond(value, patientsData:PatientsData) {
    this.patientList = [];
    this.searchSttring = "";
    this.searchForm.patchValue({
      query: patientsData.lastName + " " + patientsData.firstName,
    });
    this.showSearchSttring = false;
    this.refresh.next({id: value, data: patientsData});
  }

  searchPatients(value, page) {
    this.loading = true;

    this.apiService.searchPatients(value, page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          if (data.counts === undefined) {
            this.totalRows = 0;
          } else {
            this.totalRows = data.counts.totalRows;
          }
          this.count = data.counts;
          this.patientList = data.data;
        } else {
          this.patientList = [];
        }
        console.log(data);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  clearForm() {
    this.searchSttring = "";
    this.showSearchSttring = false;
    this.searchForm.reset();
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
  }

  addS(string, count) {
    if (count > 2) {
      return string + "s";
    }

    return string;
  }
}
