import { AxiosInstance } from "axios";

import ContactFieldsApi from "./resources/ContactFields";

export default class ContactFieldsBaseAPI {
  private client: AxiosInstance;

  private accountId: number;

  public create: ContactFieldsApi["create"];

  public get: ContactFieldsApi["get"];

  public getList: ContactFieldsApi["getList"];

  public update: ContactFieldsApi["update"];

  public delete: ContactFieldsApi["delete"];

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.accountId = accountId;
    const contactFields = new ContactFieldsApi(this.client, this.accountId);
    this.create = contactFields.create.bind(contactFields);
    this.get = contactFields.get.bind(contactFields);
    this.getList = contactFields.getList.bind(contactFields);
    this.update = contactFields.update.bind(contactFields);
    this.delete = contactFields.delete.bind(contactFields);
  }
}
