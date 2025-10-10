import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import { ListOptions, Suppression } from "../../../types/api/suppressions";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class SuppressionsApi {
  private client: AxiosInstance;

  private suppressionsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.suppressionsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/suppressions`;
  }

  /**
   * List and search suppressions by email. The endpoint returns up to 1000 suppressions per request.
   */
  public async getList(options?: ListOptions) {
    const params = {
      ...(options?.email && { email: options.email }),
    };

    return this.client.get<Suppression[], Suppression[]>(this.suppressionsURL, {
      params,
    });
  }

  /**
   * Delete a suppression by ID.
   * Mailtrap will no longer prevent sending to this email unless it's recorded in suppressions again.
   */
  public async delete(id: string) {
    return this.client.delete<Suppression, Suppression>(
      `${this.suppressionsURL}/${id}`
    );
  }
}
