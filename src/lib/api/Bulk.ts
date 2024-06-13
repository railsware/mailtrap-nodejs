import { AxiosInstance } from "axios";

import encodeMailBuffers from "../mail-buffer-encoder";

import CONFIG from "../../config";

import { Mail, SendResponse } from "../../types/mailtrap";

const { CLIENT_SETTINGS } = CONFIG;
const { BULK_ENDPOINT } = CLIENT_SETTINGS;

export default class BulkAPI {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  public async send(mail: Mail): Promise<SendResponse> {
    const url = `${BULK_ENDPOINT}/api/send`;
    const preparedMail = encodeMailBuffers(mail);

    return this.client.post<SendResponse, SendResponse>(url, preparedMail);
  }
}
