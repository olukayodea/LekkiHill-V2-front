import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ChecksService } from './checks.service';
import { User } from '../_models/users';
import { OnePatient, Patients } from '../_models/patients';
import { Invoice, OneInvoice } from '../_models/invoice';
import { InvoiceComponent, OneInvoiceComponent } from '../_models/invoiceComponent';
import { Appointments, OneAppointment } from '../_models/appointments';
import { OneVisitor, Visitors } from '../_models/visitors';
import { InventoryCategory, OneInventoryCategoryData } from '../_models/inventoryCategory';
import { Inventory, OneInventoryData } from '../_models/inventory';
import { ClinicVitals, ClinicVitalsData, VitalsData } from '../_models/clinic/vitals';
import { LabComponent } from '../_models/labComponent';
import { OneLabComponent } from '../_models/labComponent';
import { Clinic } from '../_models/clinic/data';
import { Medications, MedicationsSingle } from '../_models/clinic/medications';
import { PostOp, PostOpSingle } from '../_models/clinic/postOp';
import { DoctorsReport, DoctorsReportSingle } from '../_models/clinic/doctorsReport';
import { FluidBalance } from '../_models/clinic/fluidBalance';
import { LabTest, LabTestSingle } from '../_models/clinic/lab';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.baseUrl;
  product_key: string|number = Math.floor(Math.random() * Math.floor(999999));

  constructor(
    private http: HttpClient,
    private checkService: ChecksService
  ) {}

  // saveLocationData(locationData) {
  //     localStorage.setItem('locationData', JSON.stringify(locationData));
  // }

  /**
   * API to login User
   * @param email email address or username
   * @param password password of user
   */
  login(username, password): Observable<User> {
    const data = {
      username,
      password
    }

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    const responseData = this.post(this.baseUrl + 'admin/login', JSON.stringify(data), httpOptions);

    return responseData;
  }

  setPassword(data, token): Observable<User> {
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.put(this.baseUrl + 'admin/setPassword', JSON.stringify(data), httpOptions);

    return responseData;
  }

  logout(token) {
    var gateway_passcode = btoa(this.product_key + "_" + token);
    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'users/logout', httpOptions);

    return responseData;
  }

  modifyPassword(data): Observable<User> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.put(this.baseUrl + 'admin/updatePassword', JSON.stringify(data), httpOptions);

    return responseData;
  }

  modifyData(data): Observable<User> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.put(this.baseUrl + 'users/profile', JSON.stringify(data), httpOptions);

    return responseData;
  }

  createPatient(data): Observable<OnePatient> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'patient/manage', JSON.stringify(data), httpOptions);

    return responseData;
  }

  createVisitor(data): Observable<OneVisitor> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'visitors/manage', JSON.stringify(data), httpOptions);

    return responseData;
  }

  createInvoice(data): Observable<OneInvoice> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'invoice/manage', JSON.stringify(data), httpOptions);

    return responseData;
  }

  createAppointment(data): Observable<OneAppointment> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'appointments/manage', JSON.stringify(data), httpOptions);

    return responseData;
  }

  scheduleAppointment(data): Observable<OneAppointment> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.put(this.baseUrl + 'appointments/schedule', JSON.stringify(data), httpOptions);

    return responseData;
  }

  createInvoiceComponent(data): Observable<OneInvoiceComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'billingComponent/manage', JSON.stringify(data), httpOptions);

    return responseData;
  }

  createLabComponent(data): Observable<OneLabComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'labComponent/manage', JSON.stringify(data), httpOptions);

    return responseData;
  }

  createInventory(data): Observable<OneInventoryData> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'inventory/manage', JSON.stringify(data), httpOptions);

    return responseData;
  }

  recordVitals(data): Observable<ClinicVitalsData> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'clinic/vitals', JSON.stringify(data), httpOptions);

    return responseData;
  }

  recordPostop(data): Observable<PostOpSingle> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'clinic/postop', JSON.stringify(data), httpOptions);

    return responseData;
  }

  recordFluidBalance(data): Observable<PostOpSingle> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'clinic/fluid', JSON.stringify(data), httpOptions);

    return responseData;
  }

  recordMedication(data): Observable<MedicationsSingle> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'clinic/medication', JSON.stringify(data), httpOptions);

    return responseData;
  }

  async recordMedicationAsync(data) {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    return await this.http.post<MedicationsSingle>(this.baseUrl + 'clinic/medication', JSON.stringify(data), httpOptions).toPromise();
  }

  async recordLabTestAsync(data) {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    console.log(data);
    console.log(JSON.stringify(data));

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    return await this.http.post<LabTestSingle>(this.baseUrl + 'clinic/lab', JSON.stringify(data), httpOptions).toPromise();
  }

  recordNote(data): Observable<DoctorsReportSingle> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'clinic/notes', JSON.stringify(data), httpOptions);

    return responseData;
  }

  createInventoryCategory(data): Observable<OneInventoryCategoryData> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'inventory/category', JSON.stringify(data), httpOptions);

    return responseData;
  }

  editPatient(data): Observable<OnePatient> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.put(this.baseUrl + 'patient/manage', JSON.stringify(data), httpOptions);

    return responseData;
  }

  editInventory(data): Observable<OneInventoryData> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.put(this.baseUrl + 'inventory/manage', JSON.stringify(data), httpOptions);

    return responseData;
  }

  editAppointment(data): Observable<OneAppointment> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.put(this.baseUrl + 'appointments/manage', JSON.stringify(data), httpOptions);

    return responseData;
  }

  editInvoiceComponent(data): Observable<OneInvoiceComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.put(this.baseUrl + 'billingComponent/manage', JSON.stringify(data), httpOptions);

    return responseData;
  }

  editLabComponent(data): Observable<OneLabComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.put(this.baseUrl + 'labComponent/manage', JSON.stringify(data), httpOptions);

    return responseData;
  }

  changeComponentStatus(data): Observable<OneInvoiceComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.put(this.baseUrl + 'billingComponent/status', JSON.stringify(data), httpOptions);

    return responseData;
  }

  changeLabComponentStatus(data): Observable<OneLabComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.put(this.baseUrl + 'labComponent/status', JSON.stringify(data), httpOptions);

    return responseData;
  }

  changeInventoryStatus(data): Observable<OneInventoryData> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.put(this.baseUrl + 'inventory/manage/status', JSON.stringify(data), httpOptions);

    return responseData;
  }

  changeInventoryCategoryStatus(data): Observable<OneInventoryCategoryData> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.put(this.baseUrl + 'inventory/category/status', JSON.stringify(data), httpOptions);

    return responseData;
  }

  postPayment(data): Observable<OneInvoice> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.put(this.baseUrl + 'invoice/pay', JSON.stringify(data), httpOptions);

    return responseData;
  }

  postMultiPayment(data): Observable<Invoice> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.put(this.baseUrl + 'invoice/multiPay', JSON.stringify(data), httpOptions);

    return responseData;
  }

  getPatients(page:number): Observable<Patients> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'patient/manage/list?page='+page, httpOptions);

    return responseData;
  }

  getVisitors(page:number): Observable<Visitors> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'visitors/manage/list?page='+page, httpOptions);

    return responseData;
  }

  async getPatient(value) {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);
    
    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    return await this.http.get<Patients>(this.baseUrl + 'patient/manage/' + value, httpOptions).toPromise();
  }

  async getInventorySearch(value) {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);
    
    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    return await this.http.get<Inventory>(this.baseUrl + 'inventory/manage/search/' + value, httpOptions).toPromise();
  }

  async getLabComponentSearch(value) {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);
    
    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    return await this.http.get<LabComponent>(this.baseUrl + 'labcomponent/manage/search/' + value, httpOptions).toPromise();
  }

  getRecentVital(ref:number): Observable<ClinicVitalsData> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'clinic/vitals/recent/' + ref, httpOptions);

    return responseData;
  }

  getOneInventory(ref:number): Observable<OneInventoryData> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'inventory/manage/' + ref, httpOptions);

    return responseData;
  }

  getOnePatient(ref:number): Observable<OnePatient> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'patient/manage/' + ref, httpOptions);

    return responseData;
  }

  getOneClinicPatient(ref:number): Observable<Clinic> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'clinic/manage/' + ref, httpOptions);

    return responseData;
  }

  getOneAppointment(ref:number): Observable<OneAppointment> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'appointments/manage/' + ref, httpOptions);

    return responseData;
  }

  getOneInvoice(ref:number): Observable<OneInvoice> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'invoice/manage/' + ref, httpOptions);

    return responseData;
  }

  getInvoice(page:number, view:string): Observable<Invoice> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'invoice/manage/list/' + view +'?page='+page, httpOptions);

    return responseData;
  }

  getMedication( id:number, page:number): Observable<Medications>  {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'clinic/medication/' + id +'?page='+page, httpOptions);

    return responseData;

  }

  getFluidBalance( id:number, page:number): Observable<FluidBalance>  {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'clinic/fluid/' + id +'?page='+page, httpOptions);

    return responseData;

  }

  getPostOp( id:number, page:number): Observable<PostOp>  {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'clinic/postop/' + id +'?page='+page, httpOptions);

    return responseData;

  }

  getVitals( id:number, page:number): Observable<ClinicVitals>  {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'clinic/vitals/' + id +'?page='+page, httpOptions);

    return responseData;

  }

  getLab( id:number, page:number): Observable<LabTest>  {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'clinic/lab/' + id +'?page='+page, httpOptions);

    return responseData;

  }

  getDoctorsReport( id:number, page:number): Observable<DoctorsReport>  {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'clinic/notes/' + id +'?page='+page, httpOptions);

    return responseData;

  }

  getAppointment(page:number, view:string): Observable<Appointments> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'appointments/manage/list/' + view +'?page='+page, httpOptions);

    return responseData;
  }

  getFilteredAppointment(page:number, view:string): Observable<Appointments> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'appointments/manage/view/' + view +'?page='+page, httpOptions);

    return responseData;
  }

  getActiveInventoryCategory(): Observable<InventoryCategory> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'inventory/category/active', httpOptions);

    return responseData;
  }

  getActiveInvoiceComponent(): Observable<InvoiceComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'invoice/component', httpOptions);

    return responseData;
  }

  getInvoiceComponent(page:number): Observable<InvoiceComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'billingComponent/manage/list/?page='+page, httpOptions);

    return responseData;
  }

  getLabComponent(page:number): Observable<LabComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'labComponent/manage/list/?page='+page, httpOptions);

    return responseData;
  }

  getInventory(page:number, view:string): Observable<Inventory> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'inventory/manage/list/' + view + '?page='+page, httpOptions);

    return responseData;
  }

  getInventoryCategory(page:number, view:string): Observable<InventoryCategory> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'inventory/category/list/' + view + '?page='+page, httpOptions);

    return responseData;
  }

  searchPatients(q:string, page:number): Observable<Patients> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'patient/manage/search/'+ encodeURI(q.trim()) +'?page='+page, httpOptions);

    return responseData;
  }

  searchVisitors(q:string, page:number): Observable<Visitors> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'visitors/manage/search/'+ encodeURI(q.trim()) +'?page='+page, httpOptions);

    return responseData;
  }

  searchInvoice(q:string, page:number): Observable<Invoice> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'invoice/manage/search/'+ encodeURI(q.trim()) +'?page='+page, httpOptions);

    return responseData;
  }

  searchAppointment(q:string, page:number): Observable<Appointments> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'appointments/manage/search/'+ encodeURI(q.trim()) +'?page='+page, httpOptions);

    return responseData;
  }

  searchInvoiceComponent(q:string, page:number): Observable<InvoiceComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'billingComponent/manage/search/'+ encodeURI(q.trim()) +'?page='+page, httpOptions);

    return responseData;
  }

  searchLabComponent(q:string, page:number): Observable<LabComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'labComponent/manage/search/'+ encodeURI(q.trim()) +'?page='+page, httpOptions);

    return responseData;
  }

  searchInventory(q:string, page:number): Observable<Inventory> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'inventory/manage/search/'+ encodeURI(q.trim()) +'?page='+page, httpOptions);

    return responseData;
  }

  searchInventoryCategory(q:string, page:number): Observable<InventoryCategory> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'inventory/category/search/'+ encodeURI(q.trim()) +'?page='+page, httpOptions);

    return responseData;
  }

  deleteComponent(ref): Observable<OneInvoiceComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.delete(this.baseUrl + 'billingComponent/manage/'+ref, httpOptions);

    return responseData;
  }

  deleteLabComponent(ref): Observable<OneLabComponent> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.delete(this.baseUrl + 'labComponent/manage/'+ref, httpOptions);

    return responseData;
  }

  deleteInventory(ref): Observable<OneInventoryData> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.delete(this.baseUrl + 'inventory/manage/'+ref, httpOptions);

    return responseData;
  }

  deleteInventoryComponent(ref): Observable<OneInventoryCategoryData> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.delete(this.baseUrl + 'inventory/category/'+ref, httpOptions);

    return responseData;
  }

  deleteInvoice(ref): Observable<OneInvoice> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.delete(this.baseUrl + 'invoice/manage/'+ref, httpOptions);

    return responseData;
  }

  deleteVisitor(ref): Observable<OneVisitor> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.delete(this.baseUrl + 'visitors/manage/'+ref, httpOptions);

    return responseData;
  }

  deleteAppointment(ref): Observable<OneInvoice> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.delete(this.baseUrl + 'appointments/manage/'+ref, httpOptions);

    return responseData;
  }

  cancelAppointment(ref): Observable<OneInvoice> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.put(this.baseUrl + 'appointments/cancel/'+ref, '', httpOptions);

    return responseData;
  }
  
  /**
   * POST Request
   * @param url API URL
   * @param jsonData JSON encoded Data
   * @param httpOptions HTTP Options
   */
  post(url, jsonData, httpOptions): Observable<any> {
    return this.http.post<any>(url, jsonData, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl))
  }

  /**
   * PUT Request
   * @param url API URL
   * @param jsonData JSON encoded Data
   * @param httpOptions HTTP Options
   */
  put(url, jsonData, httpOptions): Observable<any> {
    return this.http.put<any>(url, jsonData, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl))
  }

  
  /**
   * GET request
   * @param url API URL
   * @param httpOptions HTTP Options
   */
  get(url, httpOptions): Observable<any> {
    return this.http.get<any>(url, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl))
  }

  
  /**
   * DELETE request
   * @param url API URL
   * @param httpOptions HTTP Options
   */
  delete(url, httpOptions): Observable<any> {
    return this.http.delete<any>(url, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl))
  }

  errorHandl(error) {
    return throwError("Can not connect to service "+error);
  }
}
