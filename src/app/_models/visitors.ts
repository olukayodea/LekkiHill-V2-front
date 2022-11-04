import { Counts, DateFormat, Error } from "./data";
import { AdminDataMin } from "./users";

export class Visitors {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: VisitorsData[] = [];
}

export class OneVisitor {
    success: true | false;
    error: Error;
    results: string;
    data: VisitorsData;
}

export class VisitorsData {
    ref: number;
    lastName: string;
    firstName: string;
    phoneNumber: string;
    email: string;
    address: string;
    whomToSee: {
        name: string;
        resason: string;
    };
    createdBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.createdBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}