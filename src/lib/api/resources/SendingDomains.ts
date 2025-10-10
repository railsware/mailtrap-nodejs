import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  CreateSendingDomainParams,
  SendingDomain,
  SendingDomainsResponse,
  SetupInstructionsResponse,
} from "../../../types/api/sending-domains";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class SendingDomainsApi {
  private client: AxiosInstance;

  private sendingDomainsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.sendingDomainsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/sending_domains`;
  }

  /**
   * Get a list of sending domains.
   * @returns Returns the list of sending domains for the account.
   */
  public async getList() {
    const url = this.sendingDomainsURL;

    const response = await this.client.get<
      SendingDomainsResponse,
      SendingDomainsResponse
    >(url);

    return response.data;
  }

  /**
   * Get a single sending domain by ID.
   * @param id Sending domain ID
   * @returns Returns a single sending domain
   */
  public async get(id: number) {
    const url = `${this.sendingDomainsURL}/${id}`;

    return this.client.get<SendingDomain, SendingDomain>(url);
  }

  /**
   * Create a new sending domain.
   */
  public async create(params: CreateSendingDomainParams) {
    const url = this.sendingDomainsURL;
    const data = { domain: params };

    return this.client.post<SendingDomain, SendingDomain>(url, data);
  }

  /**
   * Delete a sending domain by ID.
   * @param id Sending domain ID
   */
  public async delete(id: number) {
    const url = `${this.sendingDomainsURL}/${id}`;

    return this.client.delete(url);
  }

  /**
   * Send setup instructions for a sending domain to an email address.
   * @param id Sending domain ID
   * @param email Email address to send setup instructions to
   * @returns Returns a success message
   */
  public async sendSetupInstructions(id: number, email: string) {
    const url = `${this.sendingDomainsURL}/${id}/setup_instructions`;

    return this.client.post<
      SetupInstructionsResponse,
      SetupInstructionsResponse
    >(url, { email });
  }
}
