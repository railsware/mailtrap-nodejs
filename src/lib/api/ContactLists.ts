import { AxiosInstance } from "axios";

import ContactListsApi from "./resources/ContactLists";

export default class ContactListsBaseAPI {
  public create: ContactListsApi["create"];

  public get: ContactListsApi["get"];

  public getList: ContactListsApi["getList"];

  public update: ContactListsApi["update"];

  public delete: ContactListsApi["delete"];

  constructor(client: AxiosInstance, accountId: number) {
    const contactLists = new ContactListsApi(client, accountId);
    this.create = contactLists.create.bind(contactLists);
    this.get = contactLists.get.bind(contactLists);
    this.getList = contactLists.getList.bind(contactLists);
    this.update = contactLists.update.bind(contactLists);
    this.delete = contactLists.delete.bind(contactLists);
  }
}
