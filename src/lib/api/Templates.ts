import { AxiosInstance } from "axios";
import CONFIG from "../../config";

import {
  CreateTemplateData,
  UpdateTemplateData,
} from "../../types/api/template";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class TemplatesAPI {
  private client: AxiosInstance;

  private templatesURL: string;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.templatesURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_templates`;
  }

  /**
   * Lists all email templates for the account.
   */
  public async list() {
    return this.client.get(this.templatesURL, {
      headers: {
        Accept: "application/json",
      },
    });
  }

  /**
   * Creates a new email template.
   * @param data - The template data including name, subject, and body
   */
  public async create(data: CreateTemplateData) {
    return this.client.post(this.templatesURL, {
      email_template: data,
    });
  }

  /**
   * Updates an existing email template.
   * @param id - The ID of the template to update
   * @param data - The template data to update
   */
  public async update(id: number, data: UpdateTemplateData) {
    const url = `${this.templatesURL}/${id}`;

    return this.client.patch(url, {
      email_template: data,
    });
  }

  /**
   * Deletes an email template.
   * @param id - The ID of the template to delete
   */
  public async delete(id: number) {
    const url = `${this.templatesURL}/${id}`;

    return this.client.delete(url);
  }
}
