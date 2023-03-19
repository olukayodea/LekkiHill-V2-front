import { Counts, Error, DateFormat } from "../data";
import { PatientsData } from "../patients";
import { AdminDataMin } from "../users";

export class LabTest {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: LabTestData[] = [];
}

export class LabTestSingle {
    success: true | false;
    error: Error;
    results: string;
    data: LabTestData;
}

export class LabTestData {
    ref: number;
    doctorsReport: number;
    invoice: number;
    category: {
        title: string;
        description: string;
        cost: {
            value: number;
            label: string;
        };
    };
    notes: string;
    report: string;
    
    status: {
        new: boolean;
        pending: boolean;
        complete: boolean;
    };
    patient: PatientsData;
    createdBy: AdminDataMin;
    completedBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.patient = new PatientsData();
        this.createdBy = new AdminDataMin();
        this.completedBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}