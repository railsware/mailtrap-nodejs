import * as http from "http";
import * as https from "https";

import axios, { AxiosInstance } from "axios";

import encodeMailBuffers from "./mail-buffer-encoder";
import handleSendingError from "./axios-logger";

import GeneralAPI from "./api/General";
import TestingAPI from "./api/Testing";
import ContactsApi from "./api/resources/contacts/Contacts";

import CONFIG from "../config";

import {
  Mail,
  SendResponse,
  MailtrapClientConfig,
  BatchMail,
  BatchSendResponse,
} from "../types/mailtrap";
import MailtrapError from "./MailtrapError";

const { CLIENT_SETTINGS, ERRORS } = CONFIG;
const {
  SENDING_ENDPOINT,
  MAX_REDIRECTS,
  USER_AGENT,
  TIMEOUT,
  TESTING_ENDPOINT,
  BULK_ENDPOINT,
} = CLIENT_SETTINGS;
const { TEST_INBOX_ID_MISSING, ACCOUNT_ID_MISSING, BULK_SANDBOX_INCOMPATIBLE } =
  ERRORS;

/**
 * Mailtrap client class. Initializes instance with available methods.
 */
export default class MailtrapClient {
  private axios: AxiosInstance;

  private testInboxId?: number;

  private accountId?: number;

  private bulk: boolean;

  private sandbox: boolean;

  /**
   * Initalizes axios instance with Mailtrap params.
   */
  constructor({
    token,
    testInboxId,
    accountId,
    bulk = false,
    sandbox = false,
  }: MailtrapClientConfig) {
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

    /** Init Axios interceptors for handling response.data, errors. */
    this.axios.interceptors.response.use(
      (response) => response.data,
      handleSendingError
    );

    this.testInboxId = testInboxId;
    this.accountId = accountId;
    this.bulk = bulk;
    this.sandbox = sandbox;
  }

  /**
   * Getter for Testing API. Warns if some of the required keys are missing.
   */
  get testing() {
    if (!this.testInboxId) {
      throw new MailtrapError(TEST_INBOX_ID_MISSING);
    }

    if (!this.accountId) {
      throw new MailtrapError(ACCOUNT_ID_MISSING);
    }

    return new TestingAPI(this.axios, this.accountId);
  }

  /**
   * Getter for General API.
   */
  get general() {
    return new GeneralAPI(this.axios, this.accountId);
  }

  /**
   * Getter for Contacts API.
   */
  get contacts() {
    return new ContactsApi(this.axios, this.accountId);
  }

  /**
   * Returns configured host. Checks if `bulk` and `sandbox` modes are activated simultaneously,
   *   then reject with Mailtrap Error.
   * Otherwise returns appropriate host url.
   */
  private determineHost() {
    let host;

    if (this.bulk && this.sandbox) {
      throw new MailtrapError(BULK_SANDBOX_INCOMPATIBLE);
    } else if (this.sandbox) {
      host = TESTING_ENDPOINT;
    } else if (this.bulk) {
      host = BULK_ENDPOINT;
    } else {
      host = SENDING_ENDPOINT;
    }

    return host;
  }

  /**
   * Sends mail with given `mail` params. If there is error, rejects with `MailtrapError`.
   */
  public async send(mail: Mail): Promise<SendResponse> {
    const host = this.determineHost();
    const url = `${host}/api/send${
      this.testInboxId ? `/${this.testInboxId}` : ""
    }`;
    const preparedMail = encodeMailBuffers(mail);

    return this.axios.post<SendResponse, SendResponse>(url, preparedMail);
  }

  /**
   * Sends a batch of emails with the given array of mail objects.
   * If there is an error, rejects with MailtrapError.
   */
  public async batchSend(mails: BatchMail): Promise<BatchSendResponse> {
    const host = this.determineHost();
    const url = `${host}/api/send/batch`;
    const preparedMails = mails.map((mail) => encodeMailBuffers(mail));

    return this.axios.post<BatchSendResponse, BatchSendResponse>(
      url,
      preparedMails
    );
  }
}
