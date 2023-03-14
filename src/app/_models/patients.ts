import { AppointmentsData } from "./appointments";
import { Counts, DateFormat, Error } from "./data";
import { InvoiceData } from "./invoice";
import { AdminDataMin } from "./users";

export class Patients {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: PatientsData[] = [];
}

export class OnePatient {
    success: true | false;
    error: Error;
    results: string;
    data: PatientsData;
}

export class PatientsData {
    ref: number;
    patienrNumber: string;
    lastName: string;
    firstName: string;
    age: string;
    sex: string;
    phoneNumber: string;
    email: string;
    address: string;
    kin: KinData;
    allergies: string;
    type: string;
    appointments: AppointmentsData[] = [];
    notification: NotificationData[] = []
    invoice: InvoiceData[] = [];
    medication: [] = [];
    flags: FlagData;
    createdBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.kin = new KinData();
        this.flags = new FlagData();
        this.createdBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}

export class NotificationData {
    type: string;
    alert: string;
    count: string;
    details: string;
}

export class KinData {
    name: string;
    contact: string;
    address: string;
}

export class FlagData {
    pendingInvoice: boolean;
}