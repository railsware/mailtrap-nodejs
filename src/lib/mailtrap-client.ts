import * as http from "http";
import * as https from "https";

import axios, { AxiosInstance } from "axios";

import encodeMailBuffers from "./mail-buffer-encoder";
import handleSendingError from "./axios-logger";
import TestingAPI from "./api/Testing";

import CONFIG from "../config";

import { Mail, SendResponse, MailtrapClientConfig } from "../types/mailtrap";

const { CLIENT_SETTINGS } = CONFIG;
const { SENDING_ENDPOINT, MAX_REDIRECTS, USER_AGENT, TIMEOUT } =
  CLIENT_SETTINGS;

/**
 * Mailtrap client class. Initializes instance with available methods.
 */
export default class MailtrapClient {
  private axios: AxiosInstance;

  private testInboxId?: number;

  private accountId?: number;

  public testing: TestingAPI;

  /**
   * Initalizes axios instance with Mailtrap params.
   */
  constructor({ token, testInboxId, accountId }: MailtrapClientConfig) {
    this.axios = axios.create({
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      headers: {
        Authorization: `Bearer ${token}`,
        Connection: "keep-alive",
        "User-Agent": USER_AGENT,
      },
      maxRedirects: MAX_REDIRECTS,
      timeout: TIMEOUT,
    });
    this.testInboxId = testInboxId;
    this.accountId = accountId;

    this.testing = new TestingAPI(this.axios, this.testInboxId, this.accountId);
  }

  /**
   * Sends mail with given `mail` params. If there is error, rejects with `MailtrapError`.
   */
  public async send(mail: Mail): Promise<SendResponse> {
    const url = `${SENDING_ENDPOINT}/api/send`;
    const preparedMail = encodeMailBuffers(mail);

    try {
      const axiosResponse = await this.axios.post<SendResponse>(
        url,
        preparedMail
      );

      return axiosResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleSendingError(error);
      }

      throw error; // should not happen, but otherwise rethrow error as is
    }
  }
}
