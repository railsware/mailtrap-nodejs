import axios, { AxiosInstance } from "axios";

import ProjectsApi from "./resources/Projects";
import InboxesApi from "./resources/Inboxes";
import MessagesApi from "./resources/Messages";
import encodeMailBuffers from "../mail-buffer-encoder";
import handleSendingError from "../axios-logger";

import CONFIG from "../../config";

import { Mail, SendResponse } from "../../types/mailtrap";

const { CLIENT_SETTINGS, ERRORS } = CONFIG;
const { TESTING_ENDPOINT } = CLIENT_SETTINGS;

const { TEST_INBOX_ID_MISSING, ACCOUNT_ID_MISSING } = ERRORS;

export default class TestingAPI {
  private client: AxiosInstance;

  private testInboxId?: number;

  private accountId?: number;

  public projects: ProjectsApi;

  public inboxes: InboxesApi;

  public messages: MessagesApi;

  constructor(client: AxiosInstance, testInboxId?: number, accountId?: number) {
    this.client = client;
    if (!testInboxId) {
      // eslint-disable-next-line no-console
      console.warn(TEST_INBOX_ID_MISSING);
    }
    this.testInboxId = testInboxId;
    if (!accountId) {
      // eslint-disable-next-line no-console
      console.warn(ACCOUNT_ID_MISSING);
    }
    this.accountId = accountId;
    this.projects = new ProjectsApi(this.client, this.accountId);
    this.inboxes = new InboxesApi(this.client, this.accountId);
    this.messages = new MessagesApi(this.client, this.accountId);
  }

  public async send(mail: Mail): Promise<SendResponse> {
    const url = `${TESTING_ENDPOINT}/api/send/${this.testInboxId}`;
    const preparedMail = encodeMailBuffers(mail);

    try {
      const axiosResponse = await this.client.post<SendResponse>(
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
