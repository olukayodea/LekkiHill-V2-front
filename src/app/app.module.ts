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
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
