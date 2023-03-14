import { Counts, Error, DateFormat } from "../data";
import { AdminDataMin } from "../users";

export class DoctorsReport {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: DoctorsReportData[] = [];
}

export class DoctorsReportSingle {
    success: true | false;
    error: Error;
    results: string;
    data: DoctorsReportData;
}

export class DoctorsReportData {
    ref: number;
    weight: number;
    height: number;
    bmi: number;
    spo2: number;
    respiratory: number;
    temprature: number;
    pulse: number;
    bp_sys: number;
    bp_dia: number;
    createdBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.createdBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}