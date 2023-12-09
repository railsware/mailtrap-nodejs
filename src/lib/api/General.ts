import { AxiosInstance } from "axios";

import AccountAccessesApi from "./resources/AccountAccesses";
import AccountsApi from "./resources/Accounts";
import PermissionsApi from "./resources/Permissions";

export default class GeneralAPI {
  private client: AxiosInstance;

  private accountId?: number;

  public accountAccesses: AccountAccessesApi;

  public accounts: AccountsApi;

  public permissions: PermissionsApi;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId;
    this.accountAccesses = new AccountAccessesApi(this.client, this.accountId);
    this.accounts = new AccountsApi(this.client);
    this.permissions = new PermissionsApi(this.client, this.accountId);
  }
}
