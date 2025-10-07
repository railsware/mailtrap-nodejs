import { AxiosInstance } from "axios";

import AccountAccessesApi from "./resources/AccountAccesses";
import AccountsApi from "./resources/Accounts";
import PermissionsApi from "./resources/Permissions";

export default class GeneralAPI {
  public accountAccesses: AccountAccessesApi;

  public accounts: AccountsApi;

  public permissions: PermissionsApi;

  constructor(client: AxiosInstance, accountId: number) {
    this.accountAccesses = new AccountAccessesApi(client, accountId);
    this.accounts = new AccountsApi(client);
    this.permissions = new PermissionsApi(client, accountId);
  }
}
