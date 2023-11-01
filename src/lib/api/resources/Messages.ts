import { AxiosInstance } from "axios";

import handleSendingError from "../../axios-logger";

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

    try {
      const apiResponse = await this.client.get<Message>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
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

    try {
      const apiResponse = await this.client.patch<Message>(url, data);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Deletes message from inbox.
   */
  public async deleteMessage(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}`;

    try {
      const apiResponse = await this.client.delete<Message>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Gets all messages in inboxes.
   */
  public async get(inboxId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages`;

    try {
      const apiResponse = await this.client.get<Message[]>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
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

    try {
      const apiResponse = await this.client.post<Message>(url, data);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Gets a brief spam report by given `messageId`.
   */
  public async getSpamScore(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/spam_report`;

    try {
      const apiResponse = await this.client.get<SpamReport>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Gets a brief HTML report by message ID.
   */
  public async getHtmlAnalysis(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/analyze`;

    try {
      const apiResponse = await this.client.get<Report>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Gets text email body, if it exists.
   */
  public async getTextMessage(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/body.txt`;

    try {
      const apiResponse = await this.client.get<string>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Gets raw email body.
   */
  public async getRawMessage(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/body.raw`;

    try {
      const apiResponse = await this.client.get<string>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Gets HTML source of email.
   */
  public async getMessageHtmlSource(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/body.htmlsource`;

    try {
      const apiResponse = await this.client.get<string>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Gets formatted HTML email body. Not applicable for plain text emails.
   */
  public async getHtmlMessage(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/body.html`;

    try {
      const apiResponse = await this.client.get<string>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Gets email message in .eml format.
   */
  public async getMessageAsEml(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/body.eml`;

    try {
      const apiResponse = await this.client.get<string>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Gets mail headers of a message.
   */
  public async getMailHeaders(inboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${inboxId}/messages/${messageId}/mail_headers`;

    try {
      const apiResponse = await this.client.get<EmailHeaders>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }
}
