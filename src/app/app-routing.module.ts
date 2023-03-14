import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ClinicComponent } from './clinic/clinic.component';
import { DemoComponent } from './demo/demo.component';
import { FinanceComponent } from './finance/finance.component';
import { ManageComponentsComponent } from './finance/manage-components/manage-components.component';
import { PrintInvoiceComponent } from './finance/print-invoice/print-invoice.component';
import { ViewInvoiceComponent } from './finance/view-invoice/view-invoice.component';
import { InventoryCategoryComponent } from './inventory/inventory-category/inventory-category.component';
import { InventoryReportComponent } from './inventory/inventory-report/inventory-report.component';
import { InventoryViewComponent } from './inventory/inventory-view/inventory-view.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ComponentComponent } from './lab/component/component.component';
import { LabComponent } from './lab/lab.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PatientComponent } from './patient/patient.component';
import { ViewPatientComponent } from './patient/view-patient/view-patient.component';
import { ProfileComponent } from './profile/profile.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { SettingsComponent } from './settings/settings.component';
import { VisitorsComponent } from './visitors/visitors.component';

const routes: Routes = [
  { path: "", component: DemoComponent },
  { path: "appointments/records/:view", component: AppointmentsComponent },
  { path: "appointments/view/:id", component: AppointmentsComponent },
  { path: "appointments/:view", component: AppointmentsComponent },
  { path: "appointments", component: AppointmentsComponent },

  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "recoverPassword", component: RecoverPasswordComponent },

  { path: "patients/view/:id", component: ViewPatientComponent },
  { path: "patients", component: PatientComponent },
  
  { path: "settings", component: SettingsComponent },

  { path: "lab/component", component: ComponentComponent },
  { path: "lab", component: LabComponent },

  { path: "visitors", component: VisitorsComponent },

  { path: "profile", component: ProfileComponent },

  { path: "inventory/category/:view", component: InventoryCategoryComponent },
  { path: "inventory/category", component: InventoryCategoryComponent },
  { path: "inventory/report/:view", component: InventoryReportComponent },
  { path: "inventory/report", component: InventoryReportComponent },
  { path: "inventory/view/:id", component: InventoryViewComponent },
  { path: "inventory/:view", component: InventoryComponent },
  { path: "inventory", component: InventoryComponent },
  
  { path: "finance/components", component: ManageComponentsComponent },
  { path: "finance/report", component: FinanceComponent },
  { path: "finance/view/:id", component: ViewInvoiceComponent },
  { path: "finance/print/:id", component: PrintInvoiceComponent },
  { path: "finance/:view", component: FinanceComponent },
  { path: "finance", component: FinanceComponent },

  { path: "clinic/:id/:view", component: ClinicComponent },
  { path: "clinic/:id", component: ClinicComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
