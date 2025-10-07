import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import { Attachment } from "../../../types/api/attachments";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class AttachmentsApi {
  private client: AxiosInstance;

  private accountId: number;

  private inboxesURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.accountId = accountId;
    this.inboxesURL = `${GENERAL_ENDPOINT}/api/accounts/${this.accountId}/inboxes`;
  }

  /**
   * Get message attachments by `inboxId` and `messageId`.
   */
  public async getList(inboxId: number, messageId: number) {
    const url = `${this.inboxesURL}/${inboxId}/messages/${messageId}/attachments`;

    return this.client.get<Attachment[], Attachment[]>(url);
  }

  /**
   * Get message attachments by `inboxId`.`messageId` and `attachmentId`.
   */
  public async get(inboxId: number, messageId: number, attachmentId: number) {
    const url = `${this.inboxesURL}/${inboxId}/messages/${messageId}/attachments/${attachmentId}`;

    return this.client.get<Attachment, Attachment>(url);
  }
}
