import { Counts, Error, DateFormat } from "../data";
import { PatientsData } from "../patients";
import { AdminDataMin } from "../users";

export class FluidBalance {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: FluidBalanceData[] = [];
}

export class FluidBalanceSingle {
    success: true | false;
    error: Error;
    results: string;
    data: FluidBalanceData;
}

export class FluidBalanceData {
    ref: number;
    iv_fluid: string | number;
    amount: string | number;
    oral_fluid: string | number;
    ng_tube_feeding: string | number;
    vomit: string | number;
    urine: string | number;
    drains: string | number;
    ng_tube_drainage: string | number;
    patient: PatientsData;
    createdBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.patient = new PatientsData();
        this.createdBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}