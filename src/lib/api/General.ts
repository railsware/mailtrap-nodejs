import { AxiosInstance } from "axios";

import AccountAccessesApi from "./resources/AccountAccesses";
import AccountsApi from "./resources/Accounts";
import PermissionsApi from "./resources/Permissions";

export default class GeneralAPI {
  public accounts: AccountsApi;

  private client: AxiosInstance;

  private accountId: number | null = null;

  private accountAccessesInstance: AccountAccessesApi | null = null;

  private permissionsInstance: PermissionsApi | null = null;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId || null;
    this.accounts = new AccountsApi(client);

    // Only instantiate account-specific APIs if accountId is provided
    if (this.accountId !== null) {
      this.accountAccessesInstance = new AccountAccessesApi(
        client,
        this.accountId
      );
      this.permissionsInstance = new PermissionsApi(client, this.accountId);
    }
  }

  private checkAccountIdPresence(): number {
    if (this.accountId === null) {
      throw new Error(
        "Account ID is required for this operation. Please provide accountId when creating GeneralAPI instance."
      );
    }
    return this.accountId;
  }

  public get accountAccesses(): AccountAccessesApi {
    if (this.accountAccessesInstance === null) {
      const accountId = this.checkAccountIdPresence();
      this.accountAccessesInstance = new AccountAccessesApi(
        this.client,
        accountId
      );
    }

    return this.accountAccessesInstance;
  }

  public get permissions(): PermissionsApi {
    if (this.permissionsInstance === null) {
      const accountId = this.checkAccountIdPresence();
      this.permissionsInstance = new PermissionsApi(this.client, accountId);
    }

    return this.permissionsInstance;
  }
}
