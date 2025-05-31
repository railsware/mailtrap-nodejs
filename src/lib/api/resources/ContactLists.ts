import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import { ContactList } from "../../../types/api/contactlist";

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
   * Gets a list of contact lists.
   */
  public async list() {
    return this.client.get<ContactList[], ContactList[]>(this.contactListsURL);
  }
}
