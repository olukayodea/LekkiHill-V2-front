import { Counts, DateFormat, MoneyFormat, Error } from "./data";
import { AdminDataMin } from "./users";

export class LabComponent {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: LabComponentData[] = [];
}

export class OneLabComponent {
    success: true | false;
    error: Error;
    results: string;
    data: LabComponentData;
}

export class LabComponentData {
    ref: number;
    title: string;
    cost: MoneyFormat;
    description: string;
    status: LabComponentStatus;
    createdBy: AdminDataMin;
    lastModifiedBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.cost = new MoneyFormat();
        this.status = new LabComponentStatus();
        this.createdBy = new AdminDataMin();
        this.lastModifiedBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}

export class LabComponentStatus {
    active: boolean;
    inActive: boolean;
}