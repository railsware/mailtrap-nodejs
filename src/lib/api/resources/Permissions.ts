import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import { Attachment } from "../../../types/api/attachments";
import {
  PermissionResourceParams,
  Resource,
} from "../../../types/api/permissions";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class PermissionsApi {
  private client: AxiosInstance;

  private accountId?: number;

  private permissionsURL: string;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId;
    this.permissionsURL = `${GENERAL_ENDPOINT}/api/accounts/${this.accountId}/account_accesses`;
  }

  /**
   * Manage user or token permissions. For this endpoint, you should send an array of objects (in JSON format) as the body of the request.
   * - `resource_type` can be account, billing, project, inbox or mailsend_domain.
   * - `resource_id` the ID of the resource
   * - `access_level` can be admin or viewer or their numbers 100 and 10 respectively
   * - `_destroy(optional)` a boolean. If true, instead of creating/updating the permission, it destroys it
   *
   * If you send a combination of resource_type and resource_id that already exists, the permission is updated. If the combination doesn’t exist, the permission is created.
   */
  public async manageUserOrToken(
    accountAccessId: number,
    permissions: PermissionResourceParams[]
  ) {
    const url = `${GENERAL_ENDPOINT}/api/accounts/${this.accountId}/account_accesses/${accountAccessId}/permissions/bulk`;

    const flattenPermissionObjects = permissions.map((permission) => ({
      resource_id: permission.resourceId,
      resourceType: permission.resourceType,
      ...(permission.accessLevel && { accessLevel: permission.accessLevel }),
      // @ts-ignore
      // eslint-disable-next-line no-underscore-dangle
      ...(permission._destroy && { _destroy: permission.destroy }),
    }));
    const body = { permissions: flattenPermissionObjects };

    return this.client.put<Attachment[], Attachment[]>(url, body);
  }

  /**
   * Get all resources in your account (Inboxes, Projects, Domains, Billing and Account itself) to which the token has admin access.
   * @returns Returns the resources nested according to their hierarchy.
   */
  public async getResources() {
    const url = this.permissionsURL;

    return this.client.get<Resource[], Resource[]>(url);
  }
}
