import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import {
  AccountAccessFilters,
  DeleteAccountAccessResponse,
} from "../../../types/api/account-accesses";
import { Resource } from "../../../types/api/permissions";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class AccountsAccessesApi {
  private client: AxiosInstance;

  private accountAccessesURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.accountAccessesURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/account_accesses`;
  }

  /**
   * Get list of account accesses for which specifier_type is User or Invite.
   * You have to have account admin/owner permissions for this endpoint to work.
   * If you specify project_ids, inbox_ids or domain_uuids, the endpoint will return account accesses for these resources.
   */
  public async listAccountAccesses(filters?: AccountAccessFilters) {
    const url = this.accountAccessesURL;

    const params = filters
      ? {
          ...(filters.domainUuids && { domain_uuids: filters.domainUuids }),
          ...(filters.inboxIds && { inbox_ids: filters.inboxIds }),
          ...(filters.projectIds && { project_ids: filters.projectIds }),
        }
      : {};

    return this.client.get<Resource[], Resource[]>(url, { params });
  }

  /**
   * If specifier type is User, it removes user permissions.
   * If specifier type is Invite or ApiToken, it removes specifier along with permissions.
   * You have to be an account admin/owner for this endpoint to work.
   */
  public async removeAccountAccess(accountAccessId: number) {
    const url = `${this.accountAccessesURL}/${accountAccessId}`;

    return this.client.delete<
      DeleteAccountAccessResponse,
      DeleteAccountAccessResponse
    >(url);
  }
}
