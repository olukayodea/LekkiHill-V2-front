import { Counts, DateFormat, Error, links, MoneyFormat } from "./data";
import { AdminDataMin } from "./users";

export class Inventory {
    success: true | false;
    results: string;
    error: Error;
    counts: Counts
    data: InventoryData[] = [];
}

export class OneInventoryData {
    success: true | false;
    error: Error;
    results: string;
    data: InventoryData;
}

export class InventoryData {
    ref: number;
    title: string;
    sku: string;
    cost: MoneyFormat;
    qty_desc: string;
    status: InventoryStatus;
    category: InventoryCategory;
    quantity: number;
    links: links;
    activities: InventoryActivities[] = [];
    createdBy: AdminDataMin;
    lastModifiedBy: AdminDataMin;
    date: DateFormat;

    constructor() {
        this.cost = new MoneyFormat();
        this.status = new InventoryStatus();
        this.category = new InventoryCategory();
        this.links = new links();
        this.createdBy = new AdminDataMin();
        this.lastModifiedBy = new AdminDataMin();
        this.date = new DateFormat();
    }
}

export class InventoryCategory {
    ref: number;
    title: string;
}

export class InventoryStatus {
    active: boolean;
    inActive: boolean;
    lowAlert: boolean;
}

export class InventoryActivities {
    count: {
        after: number;
        inventoryAdded: number;
        before: number;
    }
    createdBy: AdminDataMin;
    date: DateFormat;
}