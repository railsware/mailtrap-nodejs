import { AxiosInstance } from "axios";

import ContactFieldsApi from "./resources/ContactFields";

export default class ContactFieldsBaseAPI {
  public create: ContactFieldsApi["create"];

  public get: ContactFieldsApi["get"];

  public getList: ContactFieldsApi["getList"];

  public update: ContactFieldsApi["update"];

  public delete: ContactFieldsApi["delete"];

  constructor(client: AxiosInstance, accountId: number) {
    const contactFields = new ContactFieldsApi(client, accountId);
    this.create = contactFields.create.bind(contactFields);
    this.get = contactFields.get.bind(contactFields);
    this.getList = contactFields.getList.bind(contactFields);
    this.update = contactFields.update.bind(contactFields);
    this.delete = contactFields.delete.bind(contactFields);
  }
}
