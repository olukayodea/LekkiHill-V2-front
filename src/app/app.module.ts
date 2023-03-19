import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { AppointmentsComponent } from './appointments/appointments.component';
import { DemoComponent } from './demo/demo.component';
import { SidebarComponent } from './common/widget/sidebar/sidebar.component';
import { FooterComponent } from './common/widget/footer/footer.component';
import { HeaderComponent } from './common/widget/header/header.component';
import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { PatientComponent } from './patient/patient.component';
import { PaginationComponent } from './common/widget/pagination/pagination.component';
import { ViewPatientComponent } from './patient/view-patient/view-patient.component';
import { ClinicComponent } from './clinic/clinic.component';
import { FinanceComponent } from './finance/finance.component';
import { InventoryComponent } from './inventory/inventory.component';
import { VisitorsComponent } from './visitors/visitors.component';
import { SettingsComponent } from './settings/settings.component';
import { ViewInvoiceComponent } from './finance/view-invoice/view-invoice.component';
import { ManageComponentsComponent } from './finance/manage-components/manage-components.component';
import { SearchPatientComponent } from './common/search-patient/search-patient.component';
import { PrintInvoiceComponent } from './finance/print-invoice/print-invoice.component';
import { InventoryCategoryComponent } from './inventory/inventory-category/inventory-category.component';
import { InventoryReportComponent } from './inventory/inventory-report/inventory-report.component';
import { InventoryViewComponent } from './inventory/inventory-view/inventory-view.component';
import { LogoutComponent } from './logout/logout.component';
import { AlertsComponent } from './common/widget/alerts/alerts.component';
import { VitalsComponent } from './common/widget/vitals/vitals.component';
import { AppointmentScheduleComponent } from './common/widget/appointment-schedule/appointment-schedule.component';
import { LabComponent } from './lab/lab.component';
import { ComponentComponent } from './lab/component/component.component';
import { PostPaymentComponent } from './common/widget/post-payment/post-payment.component';
import { PendingInvoiceComponent } from './common/widget/pending-invoice/pending-invoice.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewClinicComponent } from './common/widget/view-clinic/view-clinic.component';
import { ChartsComponent } from './common/widget/charts/charts.component';
import { DoctorsReportComponent } from './common/widget/doctors-report/doctors-report.component';
import { MedicationComponent } from './common/widget/medication/medication.component';
import { FluidBalanceComponent } from './common/widget/fluid-balance/fluid-balance.component';
import { PostOpComponent } from './common/widget/post-op/post-op.component';
import { RequestLabComponent } from './common/widget/request-lab/request-lab.component';
import {AutoCompleteModule} from 'angular-ngx-autocomplete';
import { NgxSummernoteModule } from 'ngx-summernote';
import { DoctorsReportMedicationComponent } from './common/widget/doctors-report-medication/doctors-report-medication.component';
import { DoctorsReportRequestLabComponent } from './common/widget/doctors-report-request-lab/doctors-report-request-lab.component';
import { PreviewComponent } from './clinic/preview/preview.component';
import { PreviewPrintComponent } from './clinic/preview-print/preview-print.component';

@NgModule({
  declarations: [
    AppComponent,
    AppointmentsComponent,
    DemoComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    RecoverPasswordComponent,
    PatientComponent,
    PaginationComponent,
    ViewPatientComponent,
    ClinicComponent,
    FinanceComponent,
    InventoryComponent,
    VisitorsComponent,
    SettingsComponent,
    ViewInvoiceComponent,
    ManageComponentsComponent,
    SearchPatientComponent,
    PrintInvoiceComponent,
    InventoryCategoryComponent,
    InventoryReportComponent,
    InventoryViewComponent,
    LogoutComponent,
    AlertsComponent,
    VitalsComponent,
    AppointmentScheduleComponent,
    LabComponent,
    ComponentComponent,
    PostPaymentComponent,
    PendingInvoiceComponent,
    ProfileComponent,
    ViewClinicComponent,
    ChartsComponent,
    DoctorsReportComponent,
    MedicationComponent,
    FluidBalanceComponent,
    PostOpComponent,
    RequestLabComponent,
    DoctorsReportMedicationComponent,
    DoctorsReportRequestLabComponent,
    PreviewComponent,
    PreviewPrintComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    AutoCompleteModule,
    NgxSummernoteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
