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
    this.create = contacts.create.bind(contacts);
    this.update = contacts.update.bind(contacts);
    this.delete = contacts.delete.bind(contacts);
    this.list = contacts.list.bind(contacts);
  }
}
