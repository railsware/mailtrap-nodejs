import { AxiosInstance } from "axios";

import ProjectsApi from "./resources/Projects";
import InboxesApi from "./resources/Inboxes";
import MessagesApi from "./resources/Messages";
import AttachmentsApi from "./resources/Attachments";

export default class TestingAPI {
  public projects: ProjectsApi;

  public inboxes: InboxesApi;

  public messages: MessagesApi;

  public attachments: AttachmentsApi;

  constructor(client: AxiosInstance, accountId: number) {
    this.projects = new ProjectsApi(client, accountId);
    this.inboxes = new InboxesApi(client, accountId);
    this.messages = new MessagesApi(client, accountId);
    this.attachments = new AttachmentsApi(client, accountId);
  }
}
