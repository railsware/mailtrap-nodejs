import { AxiosInstance } from "axios";

import handleSendingError from "../../axios-logger";

import CONFIG from "../../../config";

import { UpdateInboxParams } from "../../../types/api/inboxes";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class InboxesApi {
  private client: AxiosInstance;

  private accountId?: number;

  private inboxesURL = `${GENERAL_ENDPOINT}/api/accounts/${this.accountId}/inboxes`;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId;
  }

  /**
   * Create an inbox in a project.
   */
  public async create(projectId: number, inboxName: string) {
    const url = `${GENERAL_ENDPOINT}/api/accounts/${this.accountId}/projects/${projectId}/inboxes`;
    const data = { inbox: { name: inboxName } };

    try {
      const apiResponse = await this.client.post(url, data);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Get inbox attributes by inbox id.
   */
  public async getInboxAttributes(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}`;

    try {
      const apiResponse = await this.client.get(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Delete an inbox with all its emails.
   */
  public async delete(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}`;

    try {
      const apiResponse = await this.client.delete(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Update inbox name, inbox email username.
   */
  public async updateInbox(inboxId: number, params: UpdateInboxParams) {
    const url = `${this.inboxesURL}/${inboxId}`;
    const data = {
      inbox: {
        name: params.name,
        email_username: params.emailUsername,
      },
    };

    try {
      const apiRespone = await this.client.patch(url, data);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Delete all messages (emails) from inbox.
   */
  public async cleanInbox(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}/clean`;

    try {
      const apiRespone = await this.client.patch(url);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Mark all messages in the inbox as read.
   */
  public async markAsRead(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}/all_read`;

    try {
      const apiRespone = await this.client.patch(url);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Reset SMTP credentials of the inbox.
   */
  public async resetCredentials(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}/reset_credentials`;

    try {
      const apiRespone = await this.client.patch(url);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Turn the email address of the inbox on/off.
   */
  public async enableEmailAddress(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}/toggle_email_username`;

    try {
      const apiRespone = await this.client.patch(url);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Reset username of email address per inbox.
   */
  public async resetEmailAddress(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}/reset_email_username`;

    try {
      const apiRespone = await this.client.patch(url);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Get a list of inboxes.
   */
  public async getList() {
    try {
      const apiRespone = await this.client.get(this.inboxesURL);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }
}
