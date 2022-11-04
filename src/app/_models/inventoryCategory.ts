import { Counts, DateFormat, Error } from "./data";
import { AdminDataMin } from "./users";

export class InventoryCategory {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: InventoryCategoryData[] = [];
}

export class OneInventoryCategoryData {
    success: true | false;
    error: Error;
    results: string;
    data: InventoryCategoryData;
}

export class InventoryCategoryData {
    ref: number;
    title: string;
    status: InventoryCategoryStatus;
    createdBy: AdminDataMin;
    lastModifiedBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.status = new InventoryCategoryStatus();
        this.createdBy = new AdminDataMin();
        this.lastModifiedBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}

export class InventoryCategoryStatus {
    active: boolean;
    inActive: boolean;
}