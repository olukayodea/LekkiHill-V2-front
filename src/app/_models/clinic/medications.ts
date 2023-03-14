import { Counts, Error, DateFormat } from "../data";
import { PatientsData } from "../patients";
import { AdminDataMin } from "../users";

export class Medications {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: MedicationsData[] = [];
}

export class MedicationsSingle {
    success: true | false;
    error: Error;
    results: string;
    data: MedicationsData;
}

export class MedicationsData {
    ref: number;
    doctorsReport: number;
    invoice: number;
    quantity: number;
    route: number;
    medication: number;
    inventory: number;
    dose: number;
    frequency: number;
    status: {
        notSold: boolean;
        unPaid: boolean;
        paid: boolean;
    };
    patient: PatientsData;
    createdBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.patient = new PatientsData();
        this.createdBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}