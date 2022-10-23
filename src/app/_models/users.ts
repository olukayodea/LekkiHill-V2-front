import { AccountStatus, Error } from './data';

export class User {
  success: true|false;
  error: Error;
  results: string;
  status: string;
  token: string;
  data: UserData;
}

export class UserData {
    ref: number;
    token: string;
    username: string;
    name: string;
    email: string;
    rights: AdminRightData;
    accountStatus: AccountStatus;
    created: string;

    constructor() {
      this.rights = new AdminRightData();
      this.accountStatus = new AccountStatus();
    }
}

export class AdminRightData {
    ref: number;
    adminType: string;
    read: boolean;
    write: boolean;
    modify: boolean;
    pages: string[];
    created: string;
}

export class AdminDataMin {
    ref: number;
    username: string;
    name: string;
    email: string;
}