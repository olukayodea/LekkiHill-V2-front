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
import { InventoryComponent } from './inventory/inventory.component';
import { LoginComponent } from './login/login.component';
import { PatientComponent } from './patient/patient.component';
import { ViewPatientComponent } from './patient/view-patient/view-patient.component';
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
  { path: "recoverPassword", component: RecoverPasswordComponent },

  { path: "patients/view/:id", component: ViewPatientComponent },
  { path: "patients", component: PatientComponent },
  
  { path: "settings", component: SettingsComponent },

  { path: "visitors", component: VisitorsComponent },

  { path: "inventory/category/:view", component: InventoryCategoryComponent },
  { path: "inventory/category", component: InventoryCategoryComponent },
  { path: "inventory/report/:view", component: InventoryReportComponent },
  { path: "inventory/report", component: InventoryReportComponent },
  { path: "inventory", component: InventoryComponent },
  
  { path: "finance/components", component: ManageComponentsComponent },
  { path: "finance/report", component: FinanceComponent },
  { path: "finance/view/:id", component: ViewInvoiceComponent },
  { path: "finance/print/:id", component: PrintInvoiceComponent },
  { path: "finance/:view", component: FinanceComponent },
  { path: "finance", component: FinanceComponent },

  { path: "clinic", component: ClinicComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
