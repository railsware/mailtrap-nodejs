import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import { User } from "../../../types/api/accounts";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class AccountsApi {
  private client: AxiosInstance;

  private accountsURL: string;

  constructor(client: AxiosInstance) {
    this.client = client;
    this.accountsURL = `${GENERAL_ENDPOINT}/api/accounts`;
  }

  /**
   * Get a list of your Mailtrap accounts.
   * @returns Returns the list of accounts to which the API token has access.
   */
  public async getAllAccounts() {
    const url = this.accountsURL;

    return this.client.get<User[], User[]>(url);
  }
}
