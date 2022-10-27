import { Counts, DateFormat } from "./data";
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
    kin: {
        name: string;
        contact: string;
        address: string;
    };
    allergies: string;
    type: string;
    createdBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.createdBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}