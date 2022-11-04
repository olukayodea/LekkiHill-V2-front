import { Counts, DateFormat, MoneyFormat, Error } from "./data";
import { PatientsData } from "./patients";
import { AdminDataMin } from "./users";

export class Invoice {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: InvoiceData[] = [];
}

export class OneInvoice {
    success: true | false;
    error: Error;
    results: string;
    data: InvoiceData;
}

export class InvoiceData {
    ref: number;
    amount: MoneyFormat;
    due: MoneyFormat;
    status: InvoiceStatus;
    invoiceNumber: string;
    patient: PatientsData;
    payments: PaymentsData[] = [];
    invoiceComponent: InvoiceComponent[] = [];
    createdBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.due = new MoneyFormat();
        this.amount = new MoneyFormat();
        this.status = new InvoiceStatus();
        this.patient = new PatientsData();
        this.createdBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}

export class InvoiceComponent {
    ref: number;
    type: string;
    quantity: number;
    description: string;
    cost: MoneyFormat;
    subTotal: MoneyFormat;
    status: InvoiceStatus;
    component: {
        title: string;
        cost: MoneyFormat;
        description: string;
    };
    date: DateFormat;

    constructor() {
        this.cost = new MoneyFormat();
        this.subTotal = new MoneyFormat();
        this.status = new InvoiceStatus();
        this.date = new DateFormat();
    }
}

export class InvoiceStatus {
    unPaid: boolean;
    partiallyPaid: boolean;
    paid: boolean;
}

export class PaymentsData {
    amount: MoneyFormat;
    createdBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.amount = new MoneyFormat();
        this.createdBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}