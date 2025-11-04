import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  ContactEventOptions,
  ContactEventResponse,
} from "../../../types/api/contact-events";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ContactEventsApi {
  private client: AxiosInstance;

  private contactsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.contactsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts`;
  }

  /**
   * Creates a new contact event for given contact identifier and data.
   */
  public async create(
    contactIdentifier: number | string,
    data: ContactEventOptions
  ) {
    const url = `${this.contactsURL}/${contactIdentifier}/events`;

    return this.client.post<ContactEventResponse, ContactEventResponse>(
      url,
      data
    );
  }
}
