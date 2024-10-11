import { AxiosInstance } from "axios";

import ProjectsApi from "./resources/Projects";
import InboxesApi from "./resources/Inboxes";
import MessagesApi from "./resources/Messages";
import AttachmentsApi from "./resources/Attachments";

export default class TestingAPI {
  private client: AxiosInstance;

  private accountId?: number;

  public projects: ProjectsApi;

  public inboxes: InboxesApi;

  public messages: MessagesApi;

  public attachments: AttachmentsApi;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId;
    this.projects = new ProjectsApi(this.client, this.accountId);
    this.inboxes = new InboxesApi(this.client, this.accountId);
    this.messages = new MessagesApi(this.client, this.accountId);
    this.attachments = new AttachmentsApi(this.client, this.accountId);
  }
}
