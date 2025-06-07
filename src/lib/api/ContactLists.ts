import { AxiosInstance } from "axios";

import ContactListsApi from "./resources/ContactLists";

export default class ContactListsBaseAPI {
  private client: AxiosInstance;

  private accountId?: number;

  public create: ContactListsApi["create"];

  public get: ContactListsApi["get"];

  public getAll: ContactListsApi["getAll"];

  public update: ContactListsApi["update"];

  public delete: ContactListsApi["delete"];

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId;
    const contactLists = new ContactListsApi(this.client, this.accountId);
    this.create = contactLists.create.bind(contactLists);
    this.get = contactLists.get.bind(contactLists);
    this.getAll = contactLists.getAll.bind(contactLists);
    this.update = contactLists.update.bind(contactLists);
    this.delete = contactLists.delete.bind(contactLists);
  }
}
