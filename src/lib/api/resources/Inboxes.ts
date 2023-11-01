import { AxiosInstance } from "axios";

import handleSendingError from "../../axios-logger";

import CONFIG from "../../../config";

import { Inbox, UpdateInboxParams } from "../../../types/api/inboxes";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class InboxesApi {
  private client: AxiosInstance;

  private accountId?: number;

  private inboxesURL: string;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId;
    this.inboxesURL = `${GENERAL_ENDPOINT}/api/accounts/${this.accountId}/inboxes`;
  }

  /**
   * Creates an inbox in a project.
   */
  public async create(projectId: number, inboxName: string) {
    const url = `${GENERAL_ENDPOINT}/api/accounts/${this.accountId}/projects/${projectId}/inboxes`;
    const data = { inbox: { name: inboxName } };

    try {
      const apiResponse = await this.client.post<Inbox>(url, data);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Gets inbox attributes by inbox id.
   */
  public async getInboxAttributes(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}`;

    try {
      const apiResponse = await this.client.get<Inbox>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Deletes an inbox with all its emails.
   */
  public async delete(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}`;

    try {
      const apiResponse = await this.client.delete<Inbox>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Updates inbox name, inbox email username.
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
      const apiRespone = await this.client.patch<Inbox>(url, data);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Deletes all messages (emails) from inbox.
   */
  public async cleanInbox(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}/clean`;

    try {
      const apiRespone = await this.client.patch<Inbox>(url);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Marks all messages in the inbox as read.
   */
  public async markAsRead(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}/all_read`;

    try {
      const apiRespone = await this.client.patch<Inbox>(url);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Resets SMTP credentials of the inbox.
   */
  public async resetCredentials(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}/reset_credentials`;

    try {
      const apiRespone = await this.client.patch<Inbox>(url);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Turns the email address of the inbox on/off.
   */
  public async enableEmailAddress(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}/toggle_email_username`;

    try {
      const apiRespone = await this.client.patch<Inbox>(url);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Resets username of email address per inbox.
   */
  public async resetEmailAddress(inboxId: number) {
    const url = `${this.inboxesURL}/${inboxId}/reset_email_username`;

    try {
      const apiRespone = await this.client.patch<Inbox>(url);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Gets a list of inboxes.
   */
  public async getList() {
    try {
      const apiRespone = await this.client.get<Inbox[]>(this.inboxesURL);

      return apiRespone.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }
}
