import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ContactListsApi {
  private client: AxiosInstance;

  private contactListsURL: string;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.contactListsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists`;
  }

  /**
   * Lists all contact lists for the account.
   */
  public async list() {
    return this.client.get(this.contactListsURL);
  }
}
