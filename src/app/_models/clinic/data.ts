import { Counts, Error } from "../data";
import { DoctorsReportData } from "./doctorsReport";
import { FluidBalanceData } from "./fluidBalance";
import { MedicationsData } from "./medications";
import { PostOpData } from "./postOp";
import { VitalsChart, VitalsData } from "./vitals";

export class Clinic {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: ClinicData;
    vitals: VitalsData;
    fluidBalance: FluidBalanceData;
    postOp: PostOpData;
    medications: MedicationsData;
    doctorsReport: DoctorsReportData;
    labouratory: null;
    vitalsGraph: VitalsChart;

    constructor() {
        this.data = new ClinicData();
        this.vitals = new VitalsData();
        this.fluidBalance = new FluidBalanceData();
        this.postOp = new PostOpData();
        this.medications = new MedicationsData();
        this.doctorsReport = new DoctorsReportData();
    }
}

export class ClinicData {
    ref: number;
    patienrNumber: string;
    lastName: string;
    firstName: string;
    age: string;
    sex: string;
    phoneNumber: string;
    email: string;
}