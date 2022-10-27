import { Counts, DateFormat, MoneyFormat } from "./data";
import { AdminDataMin } from "./users";

export class InvoiceComponent {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: InvoiceComponentData[] = [];
}

export class OneInvoiceComponent {
    success: true | false;
    error: Error;
    results: string;
    data: InvoiceComponentData;
}

export class InvoiceComponentData {
    ref: number;
    title: string;
    cost: MoneyFormat;
    description: string;
    status: InvoiceComponentStatus;
    createdBy: AdminDataMin;
    lastModifiedBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.cost = new MoneyFormat();
        this.status = new InvoiceComponentStatus();
        this.createdBy = new AdminDataMin();
        this.lastModifiedBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}

export class InvoiceComponentStatus {
    active: boolean;
    inActive: boolean;
}