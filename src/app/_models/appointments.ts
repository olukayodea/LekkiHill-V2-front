import { Counts, DateFormat } from "./data";
import { PatientsData } from "./patients";
import { AdminDataMin } from "./users";

export class Appointments {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: AppointmentsData[] = [];
}

export class OneAppointment {
    success: true | false;
    error: Error;
    results: string;
    data: AppointmentsData;
}

export class AppointmentsData {
    ref: number;
    returning: boolean;
    names: string;
    email: string;
    phone: string;
    location: string;
    procedure: string;
    message: string;
    status: AppointmentStatus;
    patient: PatientsData;
    createdBy: AdminDataMin;
    lastModifiedBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.patient = new PatientsData();
        this.status = new AppointmentStatus();
        this.createdBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}

export class AppointmentStatus {
    unPaid: boolean;
    partiallyPaid: boolean;
    paid: boolean;
}