import { Counts, Error, DateFormat } from "../data";
import { PatientsData } from "../patients";
import { AdminDataMin } from "../users";

export class PostOp {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: PostOpData[] = [];
}

export class PostOpSingle {
    success: true | false;
    error: Error;
    results: string;
    data: PostOpData;
}

export class PostOpData {
    ref: number;
    surgery: string;
    surgery_category: string;
    indication: string;
    surgeon: string;
    asst_surgeon: string;
    per_op_nurse: string;
    circulating_nurse: string;
    anaesthesia: string;
    anaesthesia_time: string;
    knife_on_skin: string;
    infiltration_time: string;
    liposuction_time: string;
    end_of_surgery: string;
    procedure: string;
    amt_of_fat_right: string;
    amt_of_fat_left: string;
    amt_of_fat_other: string;
    ebl: string;
    plan: string;
    patient: PatientsData;
    createdBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.patient = new PatientsData();
        this.createdBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}