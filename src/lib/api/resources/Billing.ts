import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import { BillingCycleUsage } from "../../../types/api/billing";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class BillingApi {
  private client: AxiosInstance;

  private billingURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.billingURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/billing/usage`;
  }

  /**
   * Get billing usage for the account.
   */
  public async getCurrentBillingCycleUsage() {
    const url = this.billingURL;

    return this.client.get<BillingCycleUsage, BillingCycleUsage>(url);
  }
}
