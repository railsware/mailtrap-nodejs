import * as http from "http";
import * as https from "https";

import axios, { AxiosInstance } from "axios";

import encodeMailBuffers from "./mail-buffer-encoder";
import handleSendingError from "./axios-logger";

import GeneralAPI from "./api/General";
import TestingAPI from "./api/Testing";
import BulkAPI from "./api/Bulk";

import CONFIG from "../config";

import { Mail, SendResponse, MailtrapClientConfig } from "../types/mailtrap";

const { CLIENT_SETTINGS, ERRORS } = CONFIG;
const { SENDING_ENDPOINT, MAX_REDIRECTS, USER_AGENT, TIMEOUT } =
  CLIENT_SETTINGS;
const { TEST_INBOX_ID_MISSING, ACCOUNT_ID_MISSING } = ERRORS;

/**
 * Mailtrap client class. Initializes instance with available methods.
 */
export default class MailtrapClient {
  private axios: AxiosInstance;

  private testInboxId?: number;

  private accountId?: number;

  private testingAPI: TestingAPI;

  public general: GeneralAPI;

  public bulk: BulkAPI;

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

    /**
     * Init Axios interceptors for handling response.data, errors.
     */
    this.axios.interceptors.response.use(
      (response) => response.data,
      handleSendingError
    );
    this.testInboxId = testInboxId;
    this.accountId = accountId;

    /**
     * Initialize APIs.
     */
    this.testingAPI = new TestingAPI(
      this.axios,
      this.testInboxId,
      this.accountId
    );
    this.general = new GeneralAPI(this.axios, this.accountId);
    this.bulk = new BulkAPI(this.axios);
  }

  /**
   * Getter for testing API. Warns if some of the required keys are missing.
   */
  get testing() {
    if (!this.testInboxId) {
      // eslint-disable-next-line no-console
      console.warn(TEST_INBOX_ID_MISSING);
    }

    if (!this.accountId) {
      // eslint-disable-next-line no-console
      console.warn(ACCOUNT_ID_MISSING);
    }

    return this.testingAPI;
  }

  /**
   * Sends mail with given `mail` params. If there is error, rejects with `MailtrapError`.
   */
  public async send(mail: Mail): Promise<SendResponse> {
    const url = `${SENDING_ENDPOINT}/api/send`;
    const preparedMail = encodeMailBuffers(mail);

    return this.axios.post<SendResponse, SendResponse>(url, preparedMail);
  }
}
