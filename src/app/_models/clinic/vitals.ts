import { Counts, Error, DateFormat } from "../data";
import { AdminDataMin } from "../users";

export class ClinicVitals {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: VitalsData[] = [];
}

export class ClinicVitalsData {
    success: true | false;
    error: Error;
    results: string;
    data: VitalsData;
}

export class VitalsData {
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

export class VitalsChart {
    label: string[] = [];
    weight: string[] = [];
    bmi: string[] = [];
    sys: string[] = [];
    dia: string[] = [];
    pulse: string[] = [];
}