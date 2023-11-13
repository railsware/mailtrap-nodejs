import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import {
  EmailHeaders,
  Message,
  MessageUpdateParams,
  Report,
  SpamReport,
} from "../../../types/api/messages";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class MessagesApi {
  private client: AxiosInstance;

  private messagesURL: string;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.messagesURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes`;
  }

  /**
   * Gets email message by given `messageId`.
   */
  public async showEmailMessage(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}`;

    return this.client.get<Message, Message>(url);
  }

  /**
   * Updates message attributes (right now only the is_read attribute is available for modification).
   */
  public async updateMessage(
    inboxId: number,
    messageId: number,
    params: MessageUpdateParams
  ) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}`;
    const data = { message: { is_read: params.isRead } };

    return this.client.patch<Message, Message>(url, data);
  }

  /**
   * Deletes message from inbox.
   */
  public async deleteMessage(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}`;

    return this.client.delete<Message, Message>(url);
  }

  /**
   * Gets all messages in inboxes.
   */
  public async get(inboxId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages`;

    return this.client.get<Message[], Message[]>(url);
  }

  /**
   * Forwards message to an email address. The email address must be confirmed by the recipient in advance.
   */
  public async forward(
    inboxId: number,
    messageId: number,
    emailToForward: string
  ) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/forward`;
    const data = { email: emailToForward };

    return this.client.post<Message, Message>(url, data);
  }

  /**
   * Gets a brief spam report by given `messageId`.
   */
  public async getSpamScore(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/spam_report`;

    return this.client.get<SpamReport, SpamReport>(url);
  }

  /**
   * Gets a brief HTML report by message ID.
   */
  public async getHtmlAnalysis(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/analyze`;

    return this.client.get<Report, Report>(url);
  }

  /**
   * Gets text email body, if it exists.
   */
  public async getTextMessage(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/body.txt`;

    return this.client.get<string, string>(url);
  }

  /**
   * Gets raw email body.
   */
  public async getRawMessage(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/body.raw`;

    return this.client.get<string, string>(url);
  }

  /**
   * Gets HTML source of email.
   */
  public async getMessageHtmlSource(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/body.htmlsource`;

    return this.client.get<string, string>(url);
  }

  /**
   * Gets formatted HTML email body. Not applicable for plain text emails.
   */
  public async getHtmlMessage(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/body.html`;

    return this.client.get<string, string>(url);
  }

  /**
   * Gets email message in .eml format.
   */
  public async getMessageAsEml(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/body.eml`;

    return this.client.get<string>(url);
  }

  /**
   * Gets mail headers of a message.
   */
  public async getMailHeaders(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/mail_headers`;

    return this.client.get<EmailHeaders, EmailHeaders>(url);
  }
}
