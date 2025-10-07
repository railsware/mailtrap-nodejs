import * as http from "http";
import * as https from "https";

import axios, { AxiosInstance } from "axios";

import encodeMailBuffers from "./mail-buffer-encoder";
import handleSendingError from "./axios-logger";
import MailtrapError from "./MailtrapError";

import GeneralAPI from "./api/General";
import TestingAPI from "./api/Testing";
import ContactsBaseAPI from "./api/Contacts";
import ContactListsBaseAPI from "./api/ContactLists";
import ContactFieldsBaseAPI from "./api/ContactFields";
import TemplatesBaseAPI from "./api/Templates";
import SuppressionsBaseAPI from "./api/Suppressions";

import CONFIG from "../config";

import {
  Mail,
  SendResponse,
  MailtrapClientConfig,
  BatchSendResponse,
  BatchSendRequest,
} from "../types/mailtrap";

const { CLIENT_SETTINGS, ERRORS } = CONFIG;
const {
  SENDING_ENDPOINT,
  MAX_REDIRECTS,
  TIMEOUT,
  TESTING_ENDPOINT,
  BULK_ENDPOINT,
  USER_AGENT,
} = CLIENT_SETTINGS;
const { ACCOUNT_ID_MISSING, BULK_SANDBOX_INCOMPATIBLE, TEST_INBOX_ID_MISSING } =
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
    userAgent,
  }: MailtrapClientConfig) {
    this.axios = axios.create({
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      headers: {
        Authorization: `Bearer ${token}`,
        Connection: "keep-alive",
        "User-Agent": userAgent || USER_AGENT,
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
   * Validates that account ID is present, throws MailtrapError if missing.
   */
  private validateAccountIdPresence(): number {
    if (!this.accountId) {
      throw new MailtrapError(ACCOUNT_ID_MISSING);
    }
    return this.accountId;
  }

  /**
   * Validates that test inbox ID is present, throws MailtrapError if missing.
   */
  private validateTestInboxIdPresence(): void {
    if (this.sandbox && !this.testInboxId) {
      throw new MailtrapError(TEST_INBOX_ID_MISSING);
    }
  }

  /**
   * Getter for Testing API. Warns if some of the required keys are missing.
   */
  get testing() {
    const accountId = this.validateAccountIdPresence();
    return new TestingAPI(this.axios, accountId);
  }

  /**
   * Getter for General API.
   */
  get general() {
    const accountId = this.validateAccountIdPresence();
    return new GeneralAPI(this.axios, accountId);
  }

  /**
   * Getter for Contacts API.
   */
  get contacts() {
    const accountId = this.validateAccountIdPresence();
    return new ContactsBaseAPI(this.axios, accountId);
  }

  /**
   * Getter for Contact Lists API.
   */
  get contactLists() {
    const accountId = this.validateAccountIdPresence();
    return new ContactListsBaseAPI(this.axios, accountId);
  }

  /**
   * Getter for Contact Fields API.
   */
  get contactFields() {
    const accountId = this.validateAccountIdPresence();
    return new ContactFieldsBaseAPI(this.axios, accountId);
  }

  /**
   * Getter for Templates API.
   */
  get templates() {
    const accountId = this.validateAccountIdPresence();
    return new TemplatesBaseAPI(this.axios, accountId);
  }

  /**
   * Getter for Suppressions API.
   */
  get suppressions() {
    const accountId = this.validateAccountIdPresence();
    return new SuppressionsBaseAPI(this.axios, accountId);
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
    this.validateTestInboxIdPresence();

    const url = `${host}/api/send${
      this.sandbox && this.testInboxId ? `/${this.testInboxId}` : ""
    }`;

    const preparedMail = encodeMailBuffers(mail);

    return this.axios.post<SendResponse, SendResponse>(url, preparedMail);
  }

  /**
   * Sends a batch of emails with the given array of mail objects.
   * If there is an error, rejects with MailtrapError.
   */
  public async batchSend(
    request: BatchSendRequest
  ): Promise<BatchSendResponse> {
    const { requests, base } = request;
    const host = this.determineHost();

    this.validateTestInboxIdPresence();

    const sandbox =
      this.sandbox && this.testInboxId ? `/${this.testInboxId}` : "";

    const url = `${host}/api/batch${sandbox}`;

    const preparedBase = base ? encodeMailBuffers(base) : undefined;
    const preparedRequests = requests.map((singleRequest) =>
      encodeMailBuffers(singleRequest as Partial<Mail>)
    );

    return this.axios.post<BatchSendResponse, BatchSendResponse>(url, {
      base: preparedBase,
      requests: preparedRequests,
    });
  }
}
