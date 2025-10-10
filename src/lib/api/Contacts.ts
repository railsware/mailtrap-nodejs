import { AxiosInstance } from "axios";

import ContactsApi from "./resources/Contacts";

export default class ContactsBaseAPI {
  public get: ContactsApi["get"];

  public create: ContactsApi["create"];

  public update: ContactsApi["update"];

  public delete: ContactsApi["delete"];

  constructor(client: AxiosInstance, accountId: number) {
    const contacts = new ContactsApi(client, accountId);
    this.get = contacts.get.bind(contacts);
    this.create = contacts.create.bind(contacts);
    this.update = contacts.update.bind(contacts);
    this.delete = contacts.delete.bind(contacts);
  }
}
