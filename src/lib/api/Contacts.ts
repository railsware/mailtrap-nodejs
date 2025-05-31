import { AxiosInstance } from "axios";

import ContactsApi from "./resources/Contacts";

export default class ContactsBaseAPI {
  private client: AxiosInstance;

  private accountId?: number;

  public create: ContactsApi["create"];

  public update: ContactsApi["update"];

  public delete: ContactsApi["delete"];

  public list: ContactsApi["list"];

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId;
    const contacts = new ContactsApi(this.client, this.accountId);
    this.create = contacts.create;
    this.update = contacts.update;
    this.delete = contacts.delete;
    this.list = contacts.list;
  }
}
